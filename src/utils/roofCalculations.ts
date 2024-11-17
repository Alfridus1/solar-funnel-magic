export const calculateRoofArea = (paths: google.maps.LatLng[][]): number => {
  return paths.reduce((totalArea, path) => {
    let area = 0;
    
    for (let i = 0; i < path.length; i++) {
      const j = (i + 1) % path.length;
      area += path[i].lat() * path[j].lng();
      area -= path[j].lat() * path[i].lng();
    }
    
    area = Math.abs(area) * 111319.9 * 111319.9 / 2;
    return totalArea + area;
  }, 0);
};

export const calculateSolarMetrics = (roofArea: number) => {
  // Nutzbare Dachfläche (70% der Gesamtfläche)
  const usableArea = roofArea * 0.7;
  
  // Fläche pro Panel: 2m²
  const panelArea = 2;
  
  // Anzahl möglicher Panels
  const possiblePanels = Math.floor(usableArea / panelArea);
  
  // Monatliche Produktion basierend auf 500W Modulen
  // Annahme: durchschnittlich 3 Sonnenstunden pro Tag
  // 500W * 3h * 30 Tage = 45 kWh pro Modul pro Monat
  const monthlyProduction = Math.round(possiblePanels * 45);
  
  // Jährliche Einsparung (0,30€ pro kWh)
  const annualSavings = Math.round(monthlyProduction * 12 * 0.30);

  return {
    usableArea: Math.round(usableArea),
    possiblePanels,
    monthlyProduction,
    annualSavings,
  };
};