import { useState } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { divIcon } from "leaflet";
import { useNavigate } from "react-router-dom";
import japanRegionsRaw from "../../data/japanRegions.geojson?raw";
import { getPropertyFallbackImage } from "../../utils/propertyImage";
import { formatSafetyScoreLabel } from "../../utils/safetyScore";

const japanRegions = JSON.parse(japanRegionsRaw);

const SAITAMA_FACILITIES = {
  hospitals: [
    "Saitama Medical University Hospital",
    "Saitama Red Cross Hospital",
    "Jichi Medical University Saitama Medical Center",
    "Kawaguchi Municipal Medical Center",
    "National Hospital Organization Saitama Hospital",
  ],
  schools: [
    "Urawa High School",
    "Omiya High School",
    "Kawagoe High School",
  ],
  universities: [
    "Saitama University",
  ],
};

const getAmenityIconClass = (type) => {
  switch (type) {
    case "schools":
      return "fa-solid fa-school";
    case "universities":
      return "fa-solid fa-graduation-cap";
    case "hospitals":
      return "fa-solid fa-plus";
    default:
      return "fa-solid fa-location-dot";
  }
};

const getAmenityShape = (type) => {
  if (type === "universities") {
    return {
      borderRadius: "6px",
      markerTransform: "none",
      iconTransform: "none",
    };
  }

  if (type === "hospitals") {
    return {
      borderRadius: "5px",
      markerTransform: "rotate(45deg)",
      iconTransform: "rotate(-45deg)",
    };
  }

  return {
    borderRadius: "50%",
    markerTransform: "none",
    iconTransform: "none",
  };
};

const getAmenityStyle = (type, isActive) => {
  if (isActive) {
    return { bg: "#fafafa", fg: "#111827", border: "rgba(24,24,27,0.85)", shadow: "0 0 0 1px rgba(255,255,255,0.95), 0 3px 8px rgba(0,0,0,0.28)" };
  }

  switch (type) {
    case "schools":
      return { bg: "#18181b", fg: "#f9fafb", border: "rgba(255,255,255,0.7)", shadow: "0 2px 5px rgba(0,0,0,0.32)" };
    case "universities":
      return { bg: "#27272a", fg: "#f4f4f5", border: "rgba(255,255,255,0.7)", shadow: "0 2px 5px rgba(0,0,0,0.32)" };
    case "hospitals":
      return { bg: "#3f3f46", fg: "#fafafa", border: "rgba(255,255,255,0.7)", shadow: "0 2px 5px rgba(0,0,0,0.32)" };
    default:
      return { bg: "#3f3f46", fg: "#fafafa", border: "rgba(255,255,255,0.7)", shadow: "0 2px 5px rgba(0,0,0,0.32)" };
  }
};

const getAmenityLabel = (type) => {
  if (type === "schools") return "School";
  if (type === "universities") return "University";
  if (type === "hospitals") return "Hospital";
  return "Facility";
};

const getLargestRingFromGeometry = (geometry) => {
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
};

const getRingBounds = (ring) => {
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
};

const isPointInsideRing = (lng, lat, ring) => {
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
};

const seededRandom = (seed) => {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

const samplePointsInsideRing = (ring, count, seed) => {
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
    const [fallbackLng, fallbackLat] = ring[Math.floor(ring.length / 2)] || [139.64, 35.86];
    while (points.length < count) {
      points.push({ lat: fallbackLat, lng: fallbackLng });
    }
  }

  return points;
};

const getPrefectureFeature = (selectedPrefecture) => {
  const selectedName = String(selectedPrefecture?.name || selectedPrefecture?.id || "").toLowerCase();

  return japanRegions.features.find((feature) => {
    const name = String(feature.properties?.name || "").toLowerCase();
    const id = String(feature.properties?.id || "").toLowerCase();
    return name === selectedName || id === selectedName;
  });
};

const buildCuratedSaitamaAmenities = (properties, visibleTypes, ring, prefectureName) => {
  const amenities = [];
  
  // Fixed seeds for each type - ensures positions stay consistent regardless of filter selection
  const typeSeeds = {
    hospitals: 2030,
    schools: 2071,
    universities: 2112,
  };

  visibleTypes.forEach((type) => {
    const names = SAITAMA_FACILITIES[type] || [];
    const seed = typeSeeds[type] || 2030;
    const positions = samplePointsInsideRing(ring, names.length, seed);

    names.forEach((name, itemIndex) => {
      const property = properties[itemIndex % Math.max(1, properties.length)] || {
        id: `${type}-${itemIndex}`,
        name,
        address: `${prefectureName}, Japan`,
        price: 0,
        stationDistance: 0,
        lat: positions[itemIndex].lat,
        lng: positions[itemIndex].lng,
        imageUrl: `https://picsum.photos/seed/sumi-facility-${type}-${itemIndex}/900/520`,
      };

      amenities.push({
        id: `saitama-${type}-${itemIndex}`,
        type,
        lat: positions[itemIndex].lat,
        lng: positions[itemIndex].lng,
        name,
        locationLabel: `${prefectureName}, Japan`,
        property,
      });
    });
  });

  return amenities;
};

const buildGenericAmenities = (properties, visibleTypes, ring, prefectureName) => {
  const amenities = [];
  
  // Fixed seeds for each type - ensures positions stay consistent regardless of filter selection
  const typeSeeds = {
    hospitals: 1100,
    schools: 1159,
    universities: 1218,
  };

  visibleTypes.forEach((type) => {
    const total = properties.reduce((sum, property) => sum + (property.nearby?.[type] || 0), 0);
    if (!total) return;

    const seed = typeSeeds[type] || 1100;
    const positions = samplePointsInsideRing(ring, total, seed);
    const label = getAmenityLabel(type);

    positions.forEach((position, itemIndex) => {
      const property = properties[itemIndex % Math.max(1, properties.length)] || {
        id: `${type}-${itemIndex}`,
        name: `${label} ${itemIndex + 1}`,
        address: `${prefectureName}, Japan`,
        price: 0,
        stationDistance: 0,
        lat: position.lat,
        lng: position.lng,
        imageUrl: `https://picsum.photos/seed/sumi-generic-${type}-${itemIndex}/900/520`,
      };

      amenities.push({
        id: `generic-${type}-${itemIndex}`,
        type,
        lat: position.lat,
        lng: position.lng,
        name: `${label} ${itemIndex + 1}`,
        locationLabel: `${prefectureName}, Japan`,
        property,
      });
    });
  });

  return amenities;
};

const AmenityLayer = ({ properties, exploreStateSnapshot, selectedPrefecture, filters }) => {
  if (!selectedPrefecture) return null;
  const [selectedAmenityId, setSelectedAmenityId] = useState(null);
  const navigate = useNavigate();

  const openProperty = (property) => {
    try {
      localStorage.setItem(`sumi.propertyCache.${property.id}`, JSON.stringify(property));
    } catch {
      // Ignore storage quota/private mode issues and still attempt navigation.
    }

    navigate(`/property/${property.id}`, {
      state: {
        property,
        exploreStateSnapshot,
      },
    });
  };

  const selectedAmenityTypes = Object.entries(filters?.amenities || {})
    .filter(([, checked]) => checked)
    .map(([type]) => type);

  const visibleTypes = selectedAmenityTypes;

  if (visibleTypes.length === 0) {
    return null;
  }

  const prefectureFeature = getPrefectureFeature(selectedPrefecture);
  const ring = getLargestRingFromGeometry(prefectureFeature?.geometry);

  if (!ring) return null;

  const prefectureName = selectedPrefecture.name || selectedPrefecture.id || "Selected Prefecture";
  const isSaitama = String(prefectureName).toLowerCase() === "saitama";

  const allAmenities = isSaitama
    ? buildCuratedSaitamaAmenities(properties, visibleTypes, ring, prefectureName)
    : buildGenericAmenities(properties, visibleTypes, ring, prefectureName);

  return (
    <>
      {allAmenities.map((amenity) => {
        const isActive = selectedAmenityId === amenity.id;
        const style = getAmenityStyle(amenity.type, isActive);
        const shape = getAmenityShape(amenity.type);
        const amenityIconClass = getAmenityIconClass(amenity.type);
        const amenityLabel = getAmenityLabel(amenity.type);
        const icon = divIcon({
          className: "sumi-amenity-icon",
          html: `<div style="background:${style.bg}; color:${style.fg}; border:1px solid ${style.border}; width:20px; height:20px; border-radius:${shape.borderRadius}; transform:${shape.markerTransform}; display:flex; align-items:center; justify-content:center; box-shadow:${style.shadow};"><i class="${amenityIconClass}" style="font-size:10.5px; line-height:1; transform:${shape.iconTransform};"></i></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -10],
          tooltipAnchor: [0, -10],
        });

        return (
          <Marker
            key={amenity.id}
            position={[amenity.lat, amenity.lng]}
            icon={icon}
            eventHandlers={{
              click: () => setSelectedAmenityId(amenity.id),
              popupopen: () => setSelectedAmenityId(amenity.id),
              popupclose: () =>
                setSelectedAmenityId((current) => (current === amenity.id ? null : current)),
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1} className="sumi-amenity-tooltip">
              <span className="text-xs font-semibold">{amenity.name}</span>
            </Tooltip>

            <Popup className="sumi-property-popup sumi-amenity-popup" autoPan closeButton>
              <div
                className="sumi-popup-card sumi-popup-card-amenity cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => openProperty(amenity.property)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openProperty(amenity.property);
                  }
                }}
              >
                <div className="sumi-popup-media">
                  <img
                    src={amenity.property.imageUrl}
                    alt={`${amenity.name} area`}
                    className="sumi-popup-image"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = getPropertyFallbackImage(amenity.property);
                    }}
                  />
                  <div className="sumi-popup-media-overlay" />
                  <div className="sumi-popup-media-header">
                    <span className="sumi-popup-chip">{amenityLabel}</span>
                    <span className="sumi-popup-price">¥{amenity.property.price.toLocaleString("ja-JP")}</span>
                  </div>
                </div>

                <div className="sumi-popup-body">
                  <p className="sumi-popup-title">{amenity.name}</p>
                  <p className="sumi-popup-subtitle">{amenity.locationLabel}</p>

                  <div className="sumi-popup-score-row">
                    <span className="sumi-popup-score-label">{formatSafetyScoreLabel(amenity.property.overallScore ?? 0)}</span>
                    <span className="sumi-popup-score-value">{amenityLabel}</span>
                  </div>

                  <div className="sumi-popup-metrics">
                    <span className="sumi-popup-metric">Near {amenity.property.name}</span>
                    <span className="sumi-popup-metric">{amenity.property.stationDistance} min walk</span>
                    {amenity.property.layout ? (
                      <span className="sumi-popup-metric">{amenity.property.layout}</span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    className="mt-2 inline-flex items-center rounded-full border border-zinc-600 bg-zinc-900/90 px-3 py-1 text-[11px] font-semibold text-zinc-100 transition hover:border-zinc-400"
                    onClick={(event) => {
                      event.stopPropagation();
                      openProperty(amenity.property);
                    }}
                  >
                    Visit Property
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default AmenityLayer;
