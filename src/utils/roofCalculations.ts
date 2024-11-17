export const calculateRoofArea = (path: google.maps.LatLng[]): number => {
  let area = 0;
  
  for (let i = 0; i < path.length; i++) {
    const j = (i + 1) % path.length;
    area += path[i].lat() * path[j].lng();
    area -= path[j].lat() * path[i].lng();
  }
  
  area = Math.abs(area) * 111319.9 * 111319.9 / 2;
  return Math.round(area);
};

export const calculateSolarMetrics = (roofArea: number) => {
  const usableArea = roofArea * 0.7;
  const panelArea = 2;
  const possiblePanels = Math.floor(usableArea / panelArea);
  const monthlyProduction = Math.round(possiblePanels * 30);
  const annualSavings = Math.round(monthlyProduction * 12 * 0.30);

  return {
    usableArea: Math.round(usableArea),
    possiblePanels,
    monthlyProduction,
    annualSavings,
  };
};