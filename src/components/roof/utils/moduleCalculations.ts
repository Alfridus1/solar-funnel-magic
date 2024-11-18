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

  // Calculate grid dimensions
  const gridWidth = bounds.getNorthEast().lng() - bounds.getSouthWest().lng();
  const gridHeight = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();

  // Calculate number of modules that can fit
  const modulesInRow = Math.floor(gridWidth / (moduleWidthDeg + marginDeg));
  const modulesInColumn = Math.floor(gridHeight / (moduleHeightDeg + marginDeg));

  // Create modules
  for (let row = 0; row < modulesInColumn; row++) {
    for (let col = 0; col < modulesInRow; col++) {
      const moduleCenter = new google.maps.LatLng(
        bounds.getSouthWest().lat() + (row * (moduleHeightDeg + marginDeg)) + (moduleHeightDeg / 2),
        bounds.getSouthWest().lng() + (col * (moduleWidthDeg + marginDeg)) + (moduleWidthDeg / 2)
      );

      // Only place module if its center is within the polygon
      if (google.maps.geometry.poly.containsLocation(moduleCenter, polygon)) {
        const moduleRect = new google.maps.Rectangle({
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(
              moduleCenter.lat() - (moduleHeightDeg / 2),
              moduleCenter.lng() - (moduleWidthDeg / 2)
            ),
            new google.maps.LatLng(
              moduleCenter.lat() + (moduleHeightDeg / 2),
              moduleCenter.lng() + (moduleWidthDeg / 2)
            )
          ),
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