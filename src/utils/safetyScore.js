const scoreBands = [
  { min: 0, max: 20, label: "Critical" },
  { min: 21, max: 40, label: "Weak" },
  { min: 41, max: 60, label: "Moderate" },
  { min: 61, max: 80, label: "Strong" },
  { min: 81, max: 100, label: "Excellent" },
];

export const getSafetyScoreBand = (score) => {
  const numericScore = Number(score) || 0;
  return scoreBands.find(({ min, max }) => numericScore >= min && numericScore <= max) || scoreBands[0];
};

export const formatSafetyScoreLabel = (score) => {
  const band = getSafetyScoreBand(score);
  return `Sumi Safety Index · ${band.label}`;
};
