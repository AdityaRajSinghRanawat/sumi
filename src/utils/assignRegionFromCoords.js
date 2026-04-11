import japanRegionsRaw from "../data/japanRegions.geojson?raw";

const japanRegions = JSON.parse(japanRegionsRaw);

function pointInRing(point, ring) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];

    const intersects =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-12) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function pointInPolygon(point, polygonCoordinates) {
  if (!polygonCoordinates.length) {
    return false;
  }

  const [outerRing, ...holes] = polygonCoordinates;
  if (!pointInRing(point, outerRing)) {
    return false;
  }

  return !holes.some((hole) => pointInRing(point, hole));
}

function geometryContainsPoint(geometry, point) {
  if (!geometry) {
    return false;
  }

  if (geometry.type === "Polygon") {
    return pointInPolygon(point, geometry.coordinates);
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((polygon) => pointInPolygon(point, polygon));
  }

  return false;
}

export function assignRegionFromCoords(lat, lng) {
  const point = [lng, lat];

  const feature = japanRegions.features.find((candidate) =>
    geometryContainsPoint(candidate.geometry, point),
  );

  if (!feature) {
    return null;
  }

  return {
    id: feature.properties.id,
    name: feature.properties.name,
    macroRegion: feature.properties.region,
  };
}
