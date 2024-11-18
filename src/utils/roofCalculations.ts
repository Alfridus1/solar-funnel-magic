const MODULE_WIDTH = 1.135; // meters
const MODULE_HEIGHT = 1.962; // meters
const MODULE_AREA = MODULE_WIDTH * MODULE_HEIGHT;
const PANEL_WATTS = 400; // Typical watts per panel
const ANNUAL_KWH_PER_KWP = 1000; // Annual kWh production per kWp in Germany
const ELECTRICITY_PRICE = 0.40; // Average electricity price in EUR/kWh
const USABLE_AREA_FACTOR = 0.75; // Only use 75% of the marked area

export const calculateRoofArea = (paths: google.maps.LatLng[][]) => {
  return paths.reduce((totalArea, path) => {
    const area = google.maps.geometry.spherical.computeArea(path);
    return totalArea + area;
  }, 0);
};

export const calculateSolarMetrics = (totalRoofArea: number) => {
  // Convert from square meters to actual usable area (considering roof angle and spacing)
  const usableArea = totalRoofArea * USABLE_AREA_FACTOR;
  
  // Calculate how many panels can fit
  const possiblePanels = Math.floor(usableArea / MODULE_AREA);
  
  // Calculate system size in kWp
  const kWp = (possiblePanels * PANEL_WATTS) / 1000;
  
  // Calculate monthly production in kWh
  const monthlyProduction = Math.round((kWp * ANNUAL_KWH_PER_KWP) / 12);
  
  // Calculate annual savings in EUR
  const annualSavings = Math.round(kWp * ANNUAL_KWH_PER_KWP * ELECTRICITY_PRICE);

  return {
    usableArea: Math.round(usableArea),
    possiblePanels,
    monthlyProduction,
    annualSavings,
    kWp: Math.round(kWp * 10) / 10,
  };
};