const macroRegionDefaults = {
  Hokkaido: { marketAveragePrice: 39000000, earthquakeRiskBase: 3 },
  Tohoku: { marketAveragePrice: 43000000, earthquakeRiskBase: 5 },
  Kanto: { marketAveragePrice: 78000000, earthquakeRiskBase: 7 },
  Chubu: { marketAveragePrice: 52000000, earthquakeRiskBase: 6 },
  Kansai: { marketAveragePrice: 61000000, earthquakeRiskBase: 6 },
  Chugoku: { marketAveragePrice: 45000000, earthquakeRiskBase: 5 },
  Shikoku: { marketAveragePrice: 41000000, earthquakeRiskBase: 5 },
  Kyushu: { marketAveragePrice: 44000000, earthquakeRiskBase: 6 },
  Okinawa: { marketAveragePrice: 36000000, earthquakeRiskBase: 4 },
};

const regionOverrides = {
  JP13: { marketAveragePrice: 92000000, earthquakeRiskBase: 8 },
  JP14: { marketAveragePrice: 71000000, earthquakeRiskBase: 7 },
  JP27: { marketAveragePrice: 70000000, earthquakeRiskBase: 6 },
  JP26: { marketAveragePrice: 58000000, earthquakeRiskBase: 5 },
  JP40: { marketAveragePrice: 47000000, earthquakeRiskBase: 6 },
  JP01: { marketAveragePrice: 39000000, earthquakeRiskBase: 3 },
  JP04: { marketAveragePrice: 48000000, earthquakeRiskBase: 6 },
  JP17: { marketAveragePrice: 46000000, earthquakeRiskBase: 5 },
};

export function getRegionData(region) {
  if (!region) {
    return { marketAveragePrice: 50000000, earthquakeRiskBase: 5 };
  }

  const fromOverride = regionOverrides[region.id];
  if (fromOverride) {
    return fromOverride;
  }

  return (
    macroRegionDefaults[region.macroRegion] || {
      marketAveragePrice: 50000000,
      earthquakeRiskBase: 5,
    }
  );
}
