import { useEffect, useMemo, useRef } from "react";
import { GeoJSON, Marker, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import japanRegionsRaw from "../../data/japanRegions.geojson?raw";

const japanRegions = JSON.parse(japanRegionsRaw);

const palette = {
  Hokkaido: "#60a5fa",
  Tohoku: "#14b8a6",
  Kanto: "#f59e0b",
  Chubu: "#8b5cf6",
  Kansai: "#f43f5e",
  Chugoku: "#22c55e",
  Shikoku: "#22d3ee",
  Kyushu: "#fb7185",
  Okinawa: "#f97316",
};

const baseStyle = {
  color: "#e5e7eb",
  weight: 1.2,
  fillOpacity: 0.36,
};

// Calculate the true centroid (center of mass) of a polygon
function getPolygonCentroid(polygonCoordinates) {
  let area = 0;
  let x = 0;
  let y = 0;

  const ring = polygonCoordinates[0]; // Exterior ring

  for (let i = 0; i < ring.length - 1; i++) {
    const [lng1, lat1] = ring[i];
    const [lng2, lat2] = ring[i + 1];
    const cross = lng1 * lat2 - lng2 * lat1;

    area += cross;
    x += (lng1 + lng2) * cross;
    y += (lat1 + lat2) * cross;
  }

  area /= 2;
  if (area === 0) return [ring[0][1], ring[0][0]];

  return [y / (6 * area), x / (6 * area)];
}

function getLargestPolygon(multiPolygonCoordinates) {
  let largestPolygon = multiPolygonCoordinates[0];
  let maxArea = 0;

  multiPolygonCoordinates.forEach((polygon) => {
    const ring = polygon[0];
    let polygonArea = 0;

    for (let i = 0; i < ring.length - 1; i++) {
      const [lng1, lat1] = ring[i];
      const [lng2, lat2] = ring[i + 1];
      polygonArea += lng1 * lat2 - lng2 * lat1;
    }

    const absArea = Math.abs(polygonArea / 2);
    if (absArea > maxArea) {
      maxArea = absArea;
      largestPolygon = polygon;
    }
  });

  return largestPolygon;
}

function getPolygonBoundsFromRing(ring) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  ring.forEach(([lng, lat]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  return [[minLat, minLng], [maxLat, maxLng]];
}

function getPrefectureIdentity(feature) {
  return (
    feature?.properties?.name ||
    feature?.properties?.prefecture ||
    feature?.properties?.id ||
    ""
  );
}

// Define smart zoom bounds for each region (excluding ocean and outlier islands)
const regionBounds = {
  Hokkaido: [[41.4, 139.5], [44.8, 148.6]],
  Tohoku: [[36.9, 139.2], [40.8, 144.3]],
  Kanto: [[34.8, 138.5], [36.9, 141.2]],
  Chubu: [[34.2, 135.0], [37.2, 139.0]],
  Kansai: [[33.4, 133.6], [35.8, 136.8]],
  Chugoku: [[32.8, 130.8], [34.8, 134.8]],
  Shikoku: [[32.8, 132.2], [34.6, 135.2]],
  Kyushu: [[30.2, 129.2], [34.8, 132.0]],
  Okinawa: [[24.0, 122.8], [26.8, 131.8]],
};

// Calculate the center and zoom level to fit bounds
function calculateFitView(bounds) {
  const [[minLat, minLng], [maxLat, maxLng]] = bounds;
  const center = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
  const latDelta = maxLat - minLat;
  const lngDelta = maxLng - minLng;
  const maxDelta = Math.max(latDelta, lngDelta);

  // Approximate zoom based on delta
  const zoom = Math.log2(360 / maxDelta) - 0.7;

  return { center, zoom: Math.max(6.6, Math.min(9.6, zoom)) };
}

const regionLabelCenters = {
  Hokkaido: [43.5, 141.9],
  Tohoku: [39.5, 141.0],
  Kanto: [36.2, 139.6],
  Chubu: [36.5, 137.2],
  Kansai: [34.8, 135.1],
  Chugoku: [34.5, 132.1],
  Shikoku: [33.5, 133.6],
  Kyushu: [32.8, 130.1],
  Okinawa: [25.5, 128.0],
};

const regionViewCenters = {
  Hokkaido: [43.2, 143.3],
  Tohoku: [39.0, 141.8],
  Kanto: [35.9, 139.9],
  Chubu: [36.3, 137.7],
  Kansai: [34.8, 135.7],
  Chugoku: [34.4, 132.8],
  Shikoku: [33.7, 133.8],
  Kyushu: [32.2, 130.9],
  Okinawa: [26.0, 127.9],
};

// Get the center position for region labels
function getGeometryCenter(geometry, regionName) {
  if (regionLabelCenters[regionName]) {
    return regionLabelCenters[regionName];
  }

  // Fallback: find the largest polygon and use its centroid
  const coordinates = geometry.coordinates;

  if (!coordinates || coordinates.length === 0) return [36.2, 138.2];

  let largestPolygon = null;
  let maxArea = 0;

  coordinates.forEach((polygon) => {
    const ring = polygon[0];
    let polygonArea = 0;

    for (let i = 0; i < ring.length - 1; i++) {
      const [lng1, lat1] = ring[i];
      const [lng2, lat2] = ring[i + 1];
      polygonArea += lng1 * lat2 - lng2 * lat1;
    }

    polygonArea = Math.abs(polygonArea / 2);

    if (polygonArea > maxArea) {
      maxArea = polygonArea;
      largestPolygon = polygon;
    }
  });

  if (largestPolygon) {
    return getPolygonCentroid(largestPolygon);
  }

  return [36.2, 138.2]; // Default center of Japan
}

const RegionLayer = ({ selectedRegionId, selectedPrefectureId, onSelectRegion, onSelectPrefecture }) => {
  const map = useMap();
  const macroGeoJsonRef = useRef(null);
  const prefectureGeoJsonRef = useRef(null);
  const selectedRegionIdRef = useRef(selectedRegionId);
  const selectedPrefectureIdRef = useRef(selectedPrefectureId);

  useEffect(() => {
    selectedRegionIdRef.current = selectedRegionId;
  }, [selectedRegionId]);

  useEffect(() => {
    selectedPrefectureIdRef.current = selectedPrefectureId;
  }, [selectedPrefectureId]);

  const macroRegionGeoJson = useMemo(() => {
    const grouped = japanRegions.features.reduce((acc, feature) => {
      const macroRegion = feature.properties.region;

      if (!acc[macroRegion]) {
        acc[macroRegion] = {
          type: "Feature",
          properties: {
            id: macroRegion,
            name: macroRegion,
            macroRegion,
          },
          geometry: {
            type: "MultiPolygon",
            coordinates: [],
          },
        };
      }

      if (feature.geometry.type === "Polygon") {
        acc[macroRegion].geometry.coordinates.push(feature.geometry.coordinates);
      }

      if (feature.geometry.type === "MultiPolygon") {
        acc[macroRegion].geometry.coordinates.push(...feature.geometry.coordinates);
      }

      return acc;
    }, {});

    return {
      type: "FeatureCollection",
      features: Object.values(grouped),
    };
  }, []);

  // GeoJSON for prefectures within the selected region
  const prefectureGeoJson = useMemo(() => {
    if (!selectedRegionId) {
      return { type: "FeatureCollection", features: [] };
    }

    const selectedPrefectures = japanRegions.features.filter(
      (feature) => feature.properties.region === selectedRegionId
    );

    return {
      type: "FeatureCollection",
      features: selectedPrefectures,
    };
  }, [selectedRegionId]);

  const prefectureLabelMarkers = useMemo(() => {
    return prefectureGeoJson.features.map((feature) => ({
      id: getPrefectureIdentity(feature),
      name: getPrefectureIdentity(feature),
      position:
        feature.geometry.type === "Polygon"
          ? getPolygonCentroid(feature.geometry.coordinates)
          : feature.geometry.type === "MultiPolygon"
            ? getPolygonCentroid(getLargestPolygon(feature.geometry.coordinates))
            : [36.2, 138.2],
    }));
  }, [prefectureGeoJson]);

  const labelMarkers = useMemo(
    () =>
      macroRegionGeoJson.features.map((feature) => ({
        id: feature.properties.id,
        name: feature.properties.name,
        position: getGeometryCenter(feature.geometry, feature.properties.macroRegion),
      })),
    [macroRegionGeoJson],
  );

  const macroStyleForSelected = (feature, activeSelectedRegionId) => {
    const isSelected = feature.properties.id === activeSelectedRegionId;
    const regionColor = palette[feature.properties.macroRegion] || "#a1a1aa";

    // If a region is selected, dim all others heavily
    if (activeSelectedRegionId && !isSelected) {
      return {
        color: "#404040",
        weight: 0.5,
        fillColor: "#1f1f1f",
        fillOpacity: 0.08,
      };
    }

    return {
      ...baseStyle,
      weight: isSelected ? 2.8 : 1.2,
      color: isSelected ? "#ffffff" : "#e5e7eb",
      fillColor: regionColor,
      fillOpacity: isSelected ? 0.68 : 0.42,
    };
  };

  const style = (feature) => macroStyleForSelected(feature, selectedRegionId);

  useEffect(() => {
    if (!macroGeoJsonRef.current?.eachLayer) {
      return;
    }

    macroGeoJsonRef.current.eachLayer((layer) => {
      const feature = layer.feature;
      if (!feature) {
        return;
      }

      layer.setStyle(macroStyleForSelected(feature, selectedRegionIdRef.current));
    });
  }, [selectedRegionId]);

  const prefectureStyleForSelected = (feature, activeSelectedPrefectureId) => {
    const regionColor = palette[feature.properties.region] || "#a1a1aa";
    const isSelectedPrefecture = getPrefectureIdentity(feature) === activeSelectedPrefectureId;

    if (isSelectedPrefecture) {
      return {
        color: "#ffffff",
        weight: 2.2,
        fillColor: regionColor,
        fillOpacity: 0,
      };
    }

    return {
      color: "#888888",
      weight: 1,
      fillColor: regionColor,
      fillOpacity: 0.32,
    };
  };

  const prefectureStyle = (feature) =>
    prefectureStyleForSelected(feature, selectedPrefectureId);

  const prefectureHoverStyle = (feature) => {
    const regionColor = palette[feature.properties.region] || "#a1a1aa";
    const isSelectedPrefecture = getPrefectureIdentity(feature) === selectedPrefectureIdRef.current;

    return {
      color: "#ffffff",
      weight: isSelectedPrefecture ? 2.2 : 1.8,
      fillColor: regionColor,
      fillOpacity: isSelectedPrefecture ? 0 : 0.9,
    };
  };

  useEffect(() => {
    if (!prefectureGeoJsonRef.current?.eachLayer) {
      return;
    }

    prefectureGeoJsonRef.current.eachLayer((layer) => {
      const feature = layer.feature;
      if (!feature) {
        return;
      }

      layer.setStyle(prefectureStyleForSelected(feature, selectedPrefectureIdRef.current));
    });
  }, [selectedPrefectureId, selectedRegionId]);

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: () => {
        if (selectedRegionIdRef.current) {
          return;
        }

        const hoverColor = palette[feature.properties.macroRegion] || "#a1a1aa";
        const isSelected = feature.properties.id === selectedRegionIdRef.current;

        layer.setStyle({
          weight: isSelected ? 2.8 : 2.2,
          color: "#ffffff",
          fillColor: hoverColor,
          fillOpacity: isSelected ? 0.78 : 0.72,
        });
      },
      mouseout: () => {
        if (selectedRegionIdRef.current) {
          return;
        }

        layer.setStyle(macroStyleForSelected(feature, selectedRegionIdRef.current));
      },
      click: () => {
        if (selectedRegionIdRef.current) {
          return;
        }

        const regionName = feature.properties.macroRegion;
        const bounds = regionBounds[regionName];

        selectedRegionIdRef.current = regionName;
        selectedPrefectureIdRef.current = null;

        if (macroGeoJsonRef.current?.eachLayer) {
          macroGeoJsonRef.current.eachLayer((macroLayer) => {
            const macroFeature = macroLayer.feature;
            if (!macroFeature) {
              return;
            }

            macroLayer.setStyle(macroStyleForSelected(macroFeature, regionName));
          });
        }

        if (bounds) {
          const { center, zoom } = calculateFitView(bounds);
          map.setView(regionViewCenters[regionName] || center, zoom, { animate: true, duration: 0.8 });
        }

        onSelectRegion({
          id: feature.properties.macroRegion,
          name: feature.properties.name,
          macroRegion: feature.properties.macroRegion,
        });
      },
    });
  };

  const onEachPrefecture = (feature, layer) => {
    layer.on({
      mouseover: () => {
        layer.setStyle(prefectureHoverStyle(feature));
        layer.bringToFront();
      },
      mouseout: () => {
        layer.setStyle(
          prefectureStyleForSelected(feature, selectedPrefectureIdRef.current),
        );
      },
      click: () => {
        let targetBounds = null;
        const clickedPrefectureId = getPrefectureIdentity(feature);

        if (feature.geometry.type === "Polygon") {
          targetBounds = getPolygonBoundsFromRing(feature.geometry.coordinates[0]);
        }

        if (feature.geometry.type === "MultiPolygon") {
          const largestPolygon = getLargestPolygon(feature.geometry.coordinates);
          targetBounds = getPolygonBoundsFromRing(largestPolygon[0]);
        }

        if (targetBounds) {
          map.fitBounds(targetBounds, {
            padding: [24, 24],
            maxZoom: 11.9,
            animate: true,
            duration: 0.9,
          });
        }

        selectedPrefectureIdRef.current = clickedPrefectureId;

        if (prefectureGeoJsonRef.current?.eachLayer) {
          prefectureGeoJsonRef.current.eachLayer((prefLayer) => {
            const prefFeature = prefLayer.feature;
            if (!prefFeature) {
              return;
            }

            prefLayer.setStyle(prefectureStyleForSelected(prefFeature, clickedPrefectureId));
          });
        }

        onSelectPrefecture?.({
          id: clickedPrefectureId,
          name: clickedPrefectureId,
        });
      },
    });
  };

  return (
    <>
      {/* Show prefectures when a region is selected */}
      {selectedRegionId && prefectureGeoJson.features.length > 0 ? (
        <>
          {!selectedPrefectureId && (
            <GeoJSON
              ref={macroGeoJsonRef}
              data={macroRegionGeoJson}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}
          <GeoJSON
            ref={prefectureGeoJsonRef}
            data={prefectureGeoJson}
            style={prefectureStyle}
            onEachFeature={onEachPrefecture}
          />
          {prefectureLabelMarkers
            .filter((marker) => marker.id !== selectedPrefectureId)
            .map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              interactive={false}
              icon={divIcon({
                className: "region-label-icon",
                iconSize: [0, 0],
                iconAnchor: [0, 0],
                html: `<div class="pointer-events-none text-[9px] font-semibold uppercase tracking-wide text-white" style="display: inline-block; transform: translate(-50%, -50%); transform-origin: center center; white-space: nowrap; text-align: center; text-shadow: 0 1px 2px rgba(0,0,0,0.95);">${marker.name}</div>`,
              })}
            />
          ))}
        </>
      ) : (
        <>
          {/* Show macro-regions when no region is selected */}
          <GeoJSON
            ref={macroGeoJsonRef}
            data={macroRegionGeoJson}
            style={style}
            onEachFeature={onEachFeature}
          />
          {/* Macro-region labels */}
          {labelMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              interactive={false}
              icon={divIcon({
                className: "region-label-icon",
                iconSize: [0, 0],
                iconAnchor: [0, 0],
                html: `<div class="pointer-events-none text-[11px] font-bold uppercase tracking-widest text-white" style="display: inline-block; transform: translate(-50%, -50%); transform-origin: center center; white-space: nowrap; text-align: center; text-shadow: 0 1px 2px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.6);">${marker.name}</div>`,
              })}
            />
          ))}
        </>
      )}
    </>
  );
};

export default RegionLayer;
