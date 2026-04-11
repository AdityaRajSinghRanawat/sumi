import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Link, useLocation } from "react-router-dom";
import MapView from "../components/map/MapView";
import Sidebar from "../components/explore/Sidebar";
import { getCustomPropertiesFromLocalStorage, getSeedProperties } from "../localdb";
import { getRegionData } from "../data/regionData";
import { assignRegionFromCoords } from "../utils/assignRegionFromCoords";
import japanRegionsRaw from "../data/japanRegions.geojson?raw";

const japanRegions = JSON.parse(japanRegionsRaw);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function computeElevationLevel(lat, lng) {
  const score = Math.abs(Math.round((lat * 10 + lng * 10) % 3));
  if (score === 0) return "low";
  if (score === 1) return "medium";
  return "high";
}

function computeElevationIndex(level) {
  if (level === "low") return 1;
  if (level === "medium") return 2;
  return 3;
}

function computeOverallScore({ safetyScore, earthquakeRisk, stationDistance, elevationIndex }) {
  const score = safetyScore - earthquakeRisk * 4 - stationDistance * 0.6 + (4 - elevationIndex) * 2;
  return clamp(Math.round(score), 1, 100);
}

function getReliableImageUrl(property) {
  const seed = encodeURIComponent(property.id || `${property.lat}-${property.lng}`);
  return `https://picsum.photos/seed/sumi-${seed}/900/520`;
}

function seededRandom(seed) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function getLargestRingFromGeometry(geometry) {
  if (!geometry) return null;

  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  let largestRing = null;
  let largestArea = -1;

  polygons.forEach((polygon) => {
    const ring = polygon[0];
    if (!ring || ring.length < 4) return;

    let signedArea = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i];
      const [x2, y2] = ring[i + 1];
      signedArea += x1 * y2 - x2 * y1;
    }

    const area = Math.abs(signedArea / 2);
    if (area > largestArea) {
      largestArea = area;
      largestRing = ring;
    }
  });

  return largestRing;
}

function getRingBounds(ring) {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  ring.forEach(([lng, lat]) => {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  });

  return { minLng, maxLng, minLat, maxLat };
}

function isPointInsideRing(lng, lat, ring) {
  let isInside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    const intersects =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi + Number.EPSILON) + xi;

    if (intersects) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function samplePointsInsideRing(ring, count, seed) {
  const points = [];
  const { minLng, maxLng, minLat, maxLat } = getRingBounds(ring);
  const random = seededRandom(seed);
  const maxAttempts = count * 1000;

  for (let attempt = 0; attempt < maxAttempts && points.length < count; attempt++) {
    const lng = minLng + random() * (maxLng - minLng);
    const lat = minLat + random() * (maxLat - minLat);

    if (isPointInsideRing(lng, lat, ring)) {
      points.push({ lat, lng });
    }
  }

  if (points.length < count) {
    const [fallbackLng, fallbackLat] = ring[Math.floor(ring.length / 2)] || [139.7, 35.6];
    while (points.length < count) {
      points.push({ lat: fallbackLat, lng: fallbackLng });
    }
  }

  return points;
}

function generateNationwideSeedProperties() {
  const generated = [];
  const propertiesPerPrefecture = 3;

  japanRegions.features.forEach((feature, featureIndex) => {
    const ring = getLargestRingFromGeometry(feature.geometry);
    if (!ring) return;

    const prefectureId = feature.properties?.id;
    const prefectureName = feature.properties?.name || "Prefecture";
    const positions = samplePointsInsideRing(
      ring,
      propertiesPerPrefecture,
      7000 + featureIndex * 31,
    );

    positions.forEach((position, index) => {
      const random = seededRandom(9000 + featureIndex * 67 + index * 13);
      const priceBase = 35_000_000 + Math.floor(random() * 55_000_000);
      const builtYear = 2004 + Math.floor(random() * 20);
      const stationDistance = 4 + Math.floor(random() * 14);

      generated.push({
        id: `auto-${prefectureId}-${index + 1}`,
        name: `${prefectureName} Residence ${index + 1}`,
        address: `${prefectureName}, Japan`,
        price: priceBase,
        builtYear,
        description: `Curated property in ${prefectureName} with balanced access to transit and local facilities.`,
        lat: position.lat,
        lng: position.lng,
        stationDistance,
        tags: ["regional", "curated", "featured"],
        nearby: {
          schools: 1 + Math.floor(random() * 4),
          universities: Math.floor(random() * 2),
          hospitals: 1 + Math.floor(random() * 3),
        },
      });
    });
  });

  return generated;
}

function enrichProperty(property) {
  const region = assignRegionFromCoords(property.lat, property.lng);
  const regionData = getRegionData(region);
  const variation = Math.abs(Math.floor((property.lat * 3 + property.lng * 2) % 3));
  const earthquakeRisk = clamp(regionData.earthquakeRiskBase + variation, 1, 10);
  const safetyScore = clamp(100 - earthquakeRisk * 8 + (property.nearby?.hospitals || 0) * 2, 40, 99);
  const elevationLevel = computeElevationLevel(property.lat, property.lng);
  const elevationIndex = computeElevationIndex(elevationLevel);
  const generatedLayoutOptions = ["1LDK", "2LDK", "3LDK", "4LDK"];
  const generatedLayout = generatedLayoutOptions[(Math.abs(Math.floor(property.lat * property.lng)) + variation) % generatedLayoutOptions.length];
  const layout = property.layout || generatedLayout;
  const overallScore = property.overallScore || computeOverallScore({
    safetyScore,
    earthquakeRisk,
    stationDistance: property.stationDistance || 10,
    elevationIndex,
  });

  return {
    ...property,
    imageUrl: property.imageUrl || getReliableImageUrl(property),
    region,
    earthquakeRisk,
    safetyScore,
    elevationLevel,
    elevationIndex,
    layout,
    overallScore,
  };
}

const defaultFilters = {
  priceRange: [0, 130000000],
  roomRange: [1, 4],
  stationDistanceRange: [5, 40],
  earthquakeRiskRange: [1, 10],
  elevationRange: [1, 3],
  amenities: {
    schools: false,
    universities: false,
    hospitals: false,
  },
};

const ExplorePage = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapResetToken, setMapResetToken] = useState(0);
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("overallScore-desc");
  const [showMapFilters, setShowMapFilters] = useState(false);

  useEffect(() => {
    const custom = getCustomPropertiesFromLocalStorage();
    const localSeedProperties = getSeedProperties();
    const nationwideSeedProperties = generateNationwideSeedProperties();
    const merged = [...localSeedProperties, ...nationwideSeedProperties, ...custom].map(enrichProperty);
    setProperties(merged);
  }, []);

  useEffect(() => {
    const restore = location.state?.restoreExploreState;
    if (!restore) return;

    setCurrentStep(restore.currentStep ?? 1);
    setSelectedRegion(restore.selectedRegion ?? null);
    setSelectedPrefecture(restore.selectedPrefecture ?? null);
    setSelectedProperty(restore.selectedProperty ?? null);
    setFilters(restore.filters ?? defaultFilters);
    setSortBy(restore.sortBy ?? "overallScore-desc");
    setShowMapFilters(Boolean(restore.showMapFilters));
  }, [location.state]);

  const regionProperties = useMemo(() => {
    if (!selectedRegion) {
      return [];
    }

    return properties.filter((property) => property.region?.macroRegion === selectedRegion.id);
  }, [properties, selectedRegion]);

  const selectedPrefectureProperties = useMemo(() => {
    if (!selectedPrefecture) {
      return [];
    }

    return regionProperties.filter((property) => {
      const region = property.region;
      if (!region) {
        return false;
      }

      return (
        region.id === selectedPrefecture.id ||
        region.name === selectedPrefecture.name ||
        region.name === selectedPrefecture.id
      );
    });
  }, [regionProperties, selectedPrefecture]);

  const priceBounds = useMemo(() => {
    if (!selectedPrefectureProperties.length) {
      return { min: 0, max: 130000000 };
    }

    const max = Math.max(...selectedPrefectureProperties.map((property) => property.price));
    return {
      min: 0,
      max,
    };
  }, [selectedPrefectureProperties]);

  useEffect(() => {
    setFilters((current) => {
      const minPrice = clamp(current.priceRange[0], priceBounds.min, priceBounds.max);
      const maxPrice = clamp(current.priceRange[1], minPrice, priceBounds.max);

      if (minPrice === current.priceRange[0] && maxPrice === current.priceRange[1]) {
        return current;
      }

      return {
        ...current,
        priceRange: [minPrice, maxPrice],
      };
    });
  }, [priceBounds]);

  const filteredProperties = useMemo(() => {
    return selectedPrefectureProperties.filter((property) => {
      const rooms = Number.parseInt(property.layout, 10) || 1;

      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }

      if (rooms < filters.roomRange[0] || rooms > filters.roomRange[1]) {
        return false;
      }

      if (
        property.stationDistance < filters.stationDistanceRange[0] ||
        property.stationDistance > filters.stationDistanceRange[1]
      ) {
        return false;
      }

      if (
        property.earthquakeRisk < filters.earthquakeRiskRange[0] ||
        property.earthquakeRisk > filters.earthquakeRiskRange[1]
      ) {
        return false;
      }

      if (
        property.elevationIndex < filters.elevationRange[0] ||
        property.elevationIndex > filters.elevationRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [filters, selectedPrefectureProperties]);

  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];

    list.sort((left, right) => {
      switch (sortBy) {
        case "price-asc":
          return left.price - right.price;
        case "price-desc":
          return right.price - left.price;
        case "overallScore-asc":
          return left.overallScore - right.overallScore;
        case "overallScore-desc":
        default:
          return right.overallScore - left.overallScore;
      }
    });

    return list;
  }, [filteredProperties, sortBy]);

  const exploreStateSnapshot = useMemo(
    () => ({
      currentStep,
      selectedRegion,
      selectedPrefecture,
      selectedProperty,
      filters,
      sortBy,
      showMapFilters,
    }),
    [
      currentStep,
      selectedRegion,
      selectedPrefecture,
      selectedProperty,
      filters,
      sortBy,
      showMapFilters,
    ],
  );

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setSelectedPrefecture(null);
    setSelectedProperty(null);
    setCurrentStep(2);
  };

  const handlePrefectureSelect = (prefecture) => {
    setSelectedPrefecture(prefecture);
    setSelectedProperty(null);

    if (prefecture) {
      setCurrentStep(3);
    }
  };

  const handleBackToRegionSelection = () => {
    setSelectedRegion(null);
    setSelectedPrefecture(null);
    setSelectedProperty(null);
    setCurrentStep(1);
    setMapResetToken((current) => current + 1);
    setFilters(defaultFilters);
    setSortBy("overallScore-desc");
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[radial-gradient(circle_at_10%_10%,#111827_0%,#111111_38%,#000000_100%)] px-4 py-4 text-zinc-200 lg:px-6 lg:py-5">
      <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-300">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-100 transition hover:border-zinc-500"
          onClick={handleBackToRegionSelection}
        >
          ← Back
        </Link>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
          <span
            className={`rounded-lg px-2.5 py-1 font-semibold transition ${
              currentStep === 1
                ? "bg-zinc-100 text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.4)]"
                : "text-zinc-400"
            }`}
          >
            1 Region
          </span>
          <span>•</span>
          <span
            className={`rounded-lg px-2.5 py-1 font-semibold transition ${
              currentStep === 2
                ? "bg-zinc-100 text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.4)]"
                : "text-zinc-400"
            }`}
          >
            2 Prefecture
          </span>
          <span>•</span>
          <span
            className={`rounded-lg px-2.5 py-1 font-semibold transition ${
              currentStep === 3
                ? "bg-zinc-100 text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.4)]"
                : "text-zinc-400"
            }`}
          >
            3 Select Property
          </span>
        </div>
      </div>

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[38%_62%]">
        <Sidebar
          currentStep={currentStep}
          selectedRegion={selectedRegion}
          selectedPrefecture={selectedPrefecture}
          properties={sortedProperties}
          exploreStateSnapshot={exploreStateSnapshot}
          selectedProperty={selectedProperty}
          onHoverProperty={setSelectedProperty}
          filters={filters}
          priceBounds={priceBounds}
          onFilterChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onBackToRegionSelection={handleBackToRegionSelection}
        />

        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-700">
          <div className="flex items-center justify-between border-b border-zinc-700/70 bg-zinc-950/70 px-3 py-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-zinc-400">
                {selectedRegion
                  ? selectedPrefecture
                    ? `Selected: ${selectedRegion.name} / ${selectedPrefecture.name}`
                    : `Selected: ${selectedRegion.name}`
                  : "Choose a region"}
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <MapView
              mapResetToken={mapResetToken}
              currentStep={currentStep}
              selectedRegion={selectedRegion}
              selectedPrefecture={selectedPrefecture}
              properties={currentStep >= 3 ? sortedProperties : []}
              amenitySourceProperties={currentStep >= 3 ? selectedPrefectureProperties : []}
              selectedProperty={selectedProperty}
              filters={filters}
              exploreStateSnapshot={exploreStateSnapshot}
              showMapFilters={showMapFilters}
              priceBounds={priceBounds}
              onFilterChange={setFilters}
              onToggleMapFilters={() => setShowMapFilters(!showMapFilters)}
              onSelectRegion={handleRegionSelect}
              onSelectPrefecture={handlePrefectureSelect}
              onSelectProperty={setSelectedProperty}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExplorePage;
