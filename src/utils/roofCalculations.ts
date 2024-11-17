export const calculateRoofArea = (path: google.maps.LatLng[]): number => {
  let area = 0;
  
  for (let i = 0; i < path.length; i++) {
    const j = (i + 1) % path.length;
    area += path[i].lat() * path[j].lng();
    area -= path[j].lat() * path[i].lng();
  }
  
  area = Math.abs(area) * 111319.9 * 111319.9 / 2;
  return Math.round(area); // Returns area in square meters
};

export const calculateSolarMetrics = (roofArea: number) => {
  const usableArea = roofArea * 0.7; // 70% of roof is usable
  const panelArea = 2; // 2m² per panel
  const possiblePanels = Math.floor(usableArea / panelArea);
  const monthlyProduction = Math.round(possiblePanels * 30); // Rough estimate
  const annualSavings = Math.round(monthlyProduction * 12 * 0.30); // 30 cents per kWh

  return {
    usableArea: Math.round(usableArea),
    possiblePanels,
    monthlyProduction,
    annualSavings,
  };
};