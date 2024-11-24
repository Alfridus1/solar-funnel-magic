const MODULE_WIDTH = 1.135; // meters
const MODULE_HEIGHT = 1.962; // meters
const MODULE_AREA = MODULE_WIDTH * MODULE_HEIGHT;
const PANEL_WATTS = 500; // 500W per panel
const ANNUAL_KWH_PER_KWP = 950; // Annual kWh production per kWp in Germany
const ELECTRICITY_PRICE = 0.40; // Average electricity price in EUR/kWh
const USABLE_AREA_FACTOR = 0.65; // Considering roof angle and spacing

export const calculateRoofArea = (paths: google.maps.LatLng[][]) => {
  return paths.reduce((totalArea, path) => {
    const area = google.maps.geometry.spherical.computeArea(path);
    return totalArea + area;
  }, 0);
};

export const calculateSolarMetrics = (totalRoofArea: number) => {
  // Convert from square meters to actual usable area
  const usableArea = totalRoofArea * USABLE_AREA_FACTOR;
  
  // Calculate how many panels can fit, always rounding down to whole numbers
  const possiblePanels = Math.floor(usableArea / MODULE_AREA);
  
  // Calculate system size in kWp (500W = 0.5 kWp per module)
  // Each module is exactly 0.5 kWp, so multiply number of panels by 0.5
  const kWp = possiblePanels * 0.5;
  
  // Calculate annual production (kWp * 950 kWh/kWp)
  const annualProduction = Math.round(kWp * ANNUAL_KWH_PER_KWP);
  
  // Calculate monthly production
  const monthlyProduction = Math.round(annualProduction / 12);
  
  // Calculate annual savings
  const annualSavings = Math.round(annualProduction * ELECTRICITY_PRICE);

  return {
    usableArea: Math.round(usableArea),
    possiblePanels,
    monthlyProduction,
    annualProduction,
    annualSavings,
    kWp, // Return exact kWp (will be in 0.5 steps since each module is 0.5 kWp)
  };
};