import { MODULE_WIDTH, MODULE_HEIGHT, FRAME_MARGIN, METERS_PER_DEGREE } from './constants';

const USABLE_AREA_FACTOR = 0.75; // Only use 75% of the marked area

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

  const moduleWidthDeg = MODULE_WIDTH / lngMetersPerDegree;
  const moduleHeightDeg = MODULE_HEIGHT / latMetersPerDegree;
  const marginDeg = FRAME_MARGIN / latMetersPerDegree;

  // Adjust bounds to use only 75% of the area
  const fullHeight = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();
  const fullWidth = bounds.getNorthEast().lng() - bounds.getSouthWest().lng();
  
  const heightReduction = fullHeight * (1 - Math.sqrt(USABLE_AREA_FACTOR)) / 2;
  const widthReduction = fullWidth * (1 - Math.sqrt(USABLE_AREA_FACTOR)) / 2;

  const north = bounds.getNorthEast().lat() - heightReduction - marginDeg;
  const south = bounds.getSouthWest().lat() + heightReduction + marginDeg;
  const east = bounds.getNorthEast().lng() - widthReduction - marginDeg;
  const west = bounds.getSouthWest().lng() + widthReduction + marginDeg;

  const roofId = Math.random().toString(36).substr(2, 9);
  polygon.set('roofId', roofId);

  for (let lat = south; lat < north; lat += moduleHeightDeg) {
    for (let lng = west; lng < east; lng += moduleWidthDeg) {
      const moduleBounds = {
        north: lat + moduleHeightDeg,
        south: lat,
        east: lng + moduleWidthDeg,
        west: lng
      };

      const moduleCenter = new google.maps.LatLng(
        lat + moduleHeightDeg / 2,
        lng + moduleWidthDeg / 2
      );

      if (google.maps.geometry.poly.containsLocation(moduleCenter, polygon)) {
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

  setModules(modules);
  return { moduleCount: modules.length, roofId };
};