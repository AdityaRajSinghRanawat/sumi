export function buildMockContact(property = {}) {
  const seedSource = `${property.id || property.name || "sumi-property"}-${property.address || "tokyo"}-${property.name || "listing"}`;
  let hash = 0;

  for (let index = 0; index < seedSource.length; index += 1) {
    hash = (hash * 31 + seedSource.charCodeAt(index)) >>> 0;
  }

  const agentNames = [
    "Aiko Tanaka",
    "Kenji Sato",
    "Yui Nakamura",
    "Haruto Suzuki",
    "Mika Kobayashi",
    "Ren Takahashi",
  ];

  const branchNames = [
    "Tokyo Central",
    "Yokohama Bay",
    "Kyoto Garden",
    "Osaka Heights",
    "Sapporo North",
    "Fukuoka Harbor",
  ];

  const availability = [
    "Available for tour today",
    "Open for private viewing",
    "Ready to arrange a call",
  ];

  const agentName = agentNames[hash % agentNames.length];
  const officeBranch = branchNames[hash % branchNames.length];
  const officeLocation = `${property.address || "Tokyo, Japan"} • ${officeBranch} Office`;
  const phone = `+81 ${80 + (hash % 19)}-${String((hash * 7) % 9000 + 1000).padStart(4, "0")}-${String((hash * 13) % 9000 + 1000).padStart(4, "0")}`;
  const slug = (property.name || "property")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "listing";
  const email = `${slug}.${(hash % 99) + 1}@sumi-realty.jp`;

  return {
    agentName,
    company: "Sumi Realty Advisors",
    officeLocation,
    phone,
    email,
    availability: availability[hash % availability.length],
  };
}

export function ensurePropertyContact(property) {
  if (!property) return property;

  return {
    ...property,
    contact: property.contact || buildMockContact(property),
  };
}
