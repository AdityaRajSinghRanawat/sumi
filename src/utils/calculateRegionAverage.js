export function calculateRegionAverage(properties, regionId, mode = "prefecture") {
  const regionProperties = properties.filter((property) => {
    if (mode === "macro") {
      return property.region?.macroRegion === regionId;
    }

    return property.region?.id === regionId;
  });

  if (!regionProperties.length) {
    return 0;
  }

  const total = regionProperties.reduce((sum, property) => sum + Number(property.price || 0), 0);
  return Math.round(total / regionProperties.length);
}
