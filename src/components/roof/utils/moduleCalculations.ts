import { MODULE_WIDTH, MODULE_HEIGHT, FRAME_MARGIN, METERS_PER_DEGREE } from './constants';

export const calculateModulePositions = (
  polygon: google.maps.Polygon,
  map: google.maps.Map | null,
  setModules: (modules: google.maps.Rectangle[]) => void
) => {
  if (!map) return { moduleCount: 0, roofId: '' };
  
  const modules: google.maps.Rectangle[] = [];
  const path = polygon.getPath();
  const bounds = new google.maps.LatLngBounds();
  
  path.forEach(point => bounds.extend(point));
  
  const center = bounds.getCenter();
  const latMetersPerDegree = METERS_PER_DEGREE;
  const lngMetersPerDegree = METERS_PER_DEGREE * Math.cos(center.lat() * Math.PI / 180);

  // Convert module dimensions to degrees
  const moduleWidthDeg = MODULE_WIDTH / lngMetersPerDegree;
  const moduleHeightDeg = MODULE_HEIGHT / latMetersPerDegree;
  const marginDeg = FRAME_MARGIN / lngMetersPerDegree;

  // Calculate grid dimensions with padding
  const gridWidth = bounds.getNorthEast().lng() - bounds.getSouthWest().lng() - (2 * marginDeg);
  const gridHeight = bounds.getNorthEast().lat() - bounds.getSouthWest().lat() - (2 * marginDeg);

  // Determine orientation based on roof dimensions
  const isRoofWiderThanTall = gridWidth > gridHeight;
  
  // Align modules with the shorter side of the roof
  let effectiveModuleWidth, effectiveModuleHeight;
  if (isRoofWiderThanTall) {
    // Roof is wider than tall - align module height with roof width
    effectiveModuleWidth = moduleHeightDeg;
    effectiveModuleHeight = moduleWidthDeg;
  } else {
    // Roof is taller than wide - align module height with roof height
    effectiveModuleWidth = moduleWidthDeg;
    effectiveModuleHeight = moduleHeightDeg;
  }

  // Calculate number of modules that can fit
  const modulesInRow = Math.floor(gridWidth / (effectiveModuleWidth + marginDeg));
  const modulesInColumn = Math.floor(gridHeight / (effectiveModuleHeight + marginDeg));

  // Create modules
  for (let row = 0; row < modulesInColumn; row++) {
    for (let col = 0; col < modulesInRow; col++) {
      // Calculate center position
      const baseLat = bounds.getSouthWest().lat() + marginDeg + 
        (row * (effectiveModuleHeight + marginDeg)) + (effectiveModuleHeight / 2);
      const baseLng = bounds.getSouthWest().lng() + marginDeg + 
        (col * (effectiveModuleWidth + marginDeg)) + (effectiveModuleWidth / 2);
      
      const moduleCenter = new google.maps.LatLng(baseLat, baseLng);

      // Check if the module center is within the polygon
      if (google.maps.geometry.poly.containsLocation(moduleCenter, polygon)) {
        // Create module bounds
        const moduleBounds = {
          north: moduleCenter.lat() + (effectiveModuleHeight / 2),
          south: moduleCenter.lat() - (effectiveModuleHeight / 2),
          east: moduleCenter.lng() + (effectiveModuleWidth / 2),
          west: moduleCenter.lng() - (effectiveModuleWidth / 2)
        };

        const moduleRect = new google.maps.Rectangle({
          bounds: moduleBounds,
          map: map,
          fillColor: "#2563eb",
          fillOpacity: 0.4,
          strokeColor: "#1e40af",
          strokeWeight: 1
        });

        modules.push(moduleRect);
      }
    }
  }

  const roofId = Math.random().toString(36).substr(2, 9);
  polygon.set('roofId', roofId);

  setModules(modules);
  return { moduleCount: modules.length, roofId };
};