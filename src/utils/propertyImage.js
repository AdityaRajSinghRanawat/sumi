export const getPropertyFallbackImage = (property) =>
  `https://staticmap.openstreetmap.de/staticmap.php?center=${property.lat},${property.lng}&zoom=13&size=600x320&markers=${property.lat},${property.lng},red-pushpin`;
