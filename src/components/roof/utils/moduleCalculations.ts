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

  // Calculate the angle based on the shortest side of the polygon
  const points = path.getArray();
  let minLength = Infinity;
  let shortestSegmentAngle = 0;

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const dx = p2.lng() - p1.lng();
    const dy = p2.lat() - p1.lat();
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length < minLength) {
      minLength = length;
      shortestSegmentAngle = Math.atan2(dy, dx);
    }
  }

  // Convert module dimensions to degrees
  const moduleWidthDeg = MODULE_WIDTH / lngMetersPerDegree;
  const moduleHeightDeg = MODULE_HEIGHT / latMetersPerDegree;
  const marginDeg = FRAME_MARGIN / latMetersPerDegree;

  // Calculate usable area with safety margin
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

  // Calculate grid dimensions
  const gridWidth = east - west;
  const gridHeight = north - south;

  // Calculate number of modules that can fit in each direction
  const modulesInRow = Math.floor(gridWidth / moduleWidthDeg);
  const modulesInColumn = Math.floor(gridHeight / moduleHeightDeg);

  // Rotate module placement grid to align with shortest side
  const rotationAngle = shortestSegmentAngle + Math.PI/2; // Add 90 degrees to align parallel
  const cos = Math.cos(-rotationAngle);
  const sin = Math.sin(-rotationAngle);

  // Place modules in a grid pattern
  for (let row = 0; row < modulesInColumn; row++) {
    for (let col = 0; col < modulesInRow; col++) {
      // Calculate base position for this module
      const baseX = west + (col * moduleWidthDeg);
      const baseY = south + (row * moduleHeightDeg);

      // Calculate center point for this module
      const centerX = baseX + (moduleWidthDeg / 2);
      const centerY = baseY + (moduleHeightDeg / 2);

      // Rotate point around roof center
      const dx = centerX - center.lng();
      const dy = centerY - center.lat();
      const rotatedX = center.lng() + (dx * cos - dy * sin);
      const rotatedY = center.lat() + (dx * sin + dy * cos);

      const moduleCenter = new google.maps.LatLng(rotatedY, rotatedX);

      // Only place module if its center is within the polygon
      if (google.maps.geometry.poly.containsLocation(moduleCenter, polygon)) {
        const moduleBounds = {
          north: rotatedY + (moduleHeightDeg / 2),
          south: rotatedY - (moduleHeightDeg / 2),
          east: rotatedX + (moduleWidthDeg / 2),
          west: rotatedX - (moduleWidthDeg / 2)
        };

        const moduleRect = new google.maps.Rectangle({
          bounds: moduleBounds,
          map: map,
          fillColor: "#2563eb",
          fillOpacity: 0.4,
          strokeColor: "#1e40af",
          strokeWeight: 1,
          rotation: (rotationAngle * 180 / Math.PI)
        });

        modules.push(moduleRect);
      }
    }
  }

  setModules(modules);
  return { moduleCount: modules.length, roofId };
};