import { MODULE_WIDTH, MODULE_HEIGHT, FRAME_MARGIN, METERS_PER_DEGREE } from './constants';

const USABLE_AREA_FACTOR = 0.65; // Reduced from 0.75 to 0.65 for more safety margin

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

  // Calculate the angle of the roof based on the drawn polygon
  const points = path.getArray();
  let maxLength = 0;
  let longestSegmentAngle = 0;

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const dx = p2.lng() - p1.lng();
    const dy = p2.lat() - p1.lat();
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length > maxLength) {
      maxLength = length;
      longestSegmentAngle = Math.atan2(dy, dx);
    }
  }

  // Adjust bounds to use reduced area with safety margin
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

  // Rotate module placement grid to align with roof angle
  const cos = Math.cos(-longestSegmentAngle);
  const sin = Math.sin(-longestSegmentAngle);

  for (let lat = south; lat < north; lat += moduleHeightDeg) {
    for (let lng = west; lng < east; lng += moduleWidthDeg) {
      // Calculate module center point
      const centerLat = lat + moduleHeightDeg / 2;
      const centerLng = lng + moduleWidthDeg / 2;

      // Rotate point around roof center
      const dx = centerLng - center.lng();
      const dy = centerLat - center.lat();
      const rotatedLng = center.lng() + (dx * cos - dy * sin);
      const rotatedLat = center.lat() + (dx * sin + dy * cos);

      const moduleCenter = new google.maps.LatLng(rotatedLat, rotatedLng);

      // Check if module center is within polygon with additional safety check
      if (google.maps.geometry.poly.containsLocation(moduleCenter, polygon)) {
        // Create module rectangle with rotation
        const moduleBounds = {
          north: rotatedLat + (moduleHeightDeg / 2),
          south: rotatedLat - (moduleHeightDeg / 2),
          east: rotatedLng + (moduleWidthDeg / 2),
          west: rotatedLng - (moduleWidthDeg / 2)
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

  setModules(modules);
  return { moduleCount: modules.length, roofId };
};