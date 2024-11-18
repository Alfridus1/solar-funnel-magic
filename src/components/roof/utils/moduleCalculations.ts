import { MODULE_WIDTH, MODULE_HEIGHT, FRAME_MARGIN, METERS_PER_DEGREE } from './constants';

const USABLE_AREA_FACTOR = 0.65;

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

  // Calculate the polygon's area and dimensions
  const points = path.getArray();
  const area = google.maps.geometry.spherical.computeArea(points);
  
  // Try both orientations (0 and 90 degrees) to find which fits more modules
  const orientations = [45, 135];
  let maxModules = 0;
  let bestOrientation = 45;
  let bestModulePositions: google.maps.LatLng[][] = [];

  orientations.forEach(orientation => {
    const angleRad = (orientation * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    // Calculate module dimensions in degrees with rotation
    const rotatedWidth = Math.abs(MODULE_WIDTH * cos / lngMetersPerDegree) + 
                        Math.abs(MODULE_HEIGHT * sin / latMetersPerDegree);
    const rotatedHeight = Math.abs(MODULE_WIDTH * sin / lngMetersPerDegree) + 
                         Math.abs(MODULE_HEIGHT * cos / latMetersPerDegree);

    // Calculate grid dimensions
    const gridWidth = bounds.getNorthEast().lng() - bounds.getSouthWest().lng();
    const gridHeight = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();

    // Calculate number of modules that can fit
    const modulesInRow = Math.floor(gridWidth / (rotatedWidth + FRAME_MARGIN / lngMetersPerDegree));
    const modulesInColumn = Math.floor(gridHeight / (rotatedHeight + FRAME_MARGIN / latMetersPerDegree));
    const totalModules = modulesInRow * modulesInColumn;

    if (totalModules > maxModules) {
      maxModules = totalModules;
      bestOrientation = orientation;
      bestModulePositions = [];

      // Calculate module positions for this orientation
      for (let row = 0; row < modulesInColumn; row++) {
        for (let col = 0; col < modulesInRow; col++) {
          const baseX = bounds.getSouthWest().lng() + (col * (rotatedWidth + FRAME_MARGIN / lngMetersPerDegree));
          const baseY = bounds.getSouthWest().lat() + (row * (rotatedHeight + FRAME_MARGIN / latMetersPerDegree));

          // Calculate module corners with rotation
          const cornerOffsetX = MODULE_WIDTH / (2 * lngMetersPerDegree);
          const cornerOffsetY = MODULE_HEIGHT / (2 * latMetersPerDegree);
          
          const corners = [
            [-cornerOffsetX, -cornerOffsetY],
            [cornerOffsetX, -cornerOffsetY],
            [cornerOffsetX, cornerOffsetY],
            [-cornerOffsetX, cornerOffsetY]
          ].map(([x, y]) => {
            const rotX = x * cos - y * sin;
            const rotY = x * sin + y * cos;
            return new google.maps.LatLng(
              baseY + rotY + (rotatedHeight / 2),
              baseX + rotX + (rotatedWidth / 2)
            );
          });

          const moduleCenter = new google.maps.LatLng(
            baseY + (rotatedHeight / 2),
            baseX + (rotatedWidth / 2)
          );

          if (google.maps.geometry.poly.containsLocation(moduleCenter, polygon)) {
            bestModulePositions.push(corners);
          }
        }
      }
    }
  });

  // Create modules using the best orientation found
  bestModulePositions.forEach(corners => {
    const modulePolygon = new google.maps.Polygon({
      paths: corners,
      map: map,
      fillColor: "#2563eb",
      fillOpacity: 0.4,
      strokeColor: "#1e40af",
      strokeWeight: 1
    });

    modules.push(modulePolygon as unknown as google.maps.Rectangle);
  });

  const roofId = Math.random().toString(36).substr(2, 9);
  polygon.set('roofId', roofId);

  setModules(modules);
  return { moduleCount: modules.length, roofId };
};