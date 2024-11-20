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
  
  // Get polygon vertices
  const vertices = path.getArray();
  path.forEach(point => bounds.extend(point));
  
  const center = bounds.getCenter();
  const latMetersPerDegree = METERS_PER_DEGREE;
  const lngMetersPerDegree = METERS_PER_DEGREE * Math.cos(center.lat() * Math.PI / 180);

  // Calculate primary roof direction based on longest edge
  let longestEdgeLength = 0;
  let primaryAngle = 0;
  
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    
    const dx = (next.lng() - current.lng()) * lngMetersPerDegree;
    const dy = (next.lat() - current.lat()) * latMetersPerDegree;
    const edgeLength = Math.sqrt(dx * dx + dy * dy);
    
    if (edgeLength > longestEdgeLength) {
      longestEdgeLength = edgeLength;
      primaryAngle = Math.atan2(dy, dx);
    }
  }

  // Convert module dimensions to degrees
  const moduleWidthDeg = MODULE_WIDTH / lngMetersPerDegree;
  const moduleHeightDeg = MODULE_HEIGHT / latMetersPerDegree;
  const marginDeg = FRAME_MARGIN / lngMetersPerDegree;

  // Calculate rotated grid dimensions
  const cos = Math.cos(primaryAngle);
  const sin = Math.sin(primaryAngle);
  
  // Calculate grid bounds
  const gridWidth = bounds.getNorthEast().lng() - bounds.getSouthWest().lng() - (2 * marginDeg);
  const gridHeight = bounds.getNorthEast().lat() - bounds.getSouthWest().lat() - (2 * marginDeg);

  // Calculate number of modules that can fit
  const modulesInRow = Math.floor(gridWidth / (moduleWidthDeg + marginDeg));
  const modulesInColumn = Math.floor(gridHeight / (moduleHeightDeg + marginDeg));

  // Create modules with rotation
  for (let row = 0; row < modulesInColumn; row++) {
    for (let col = 0; col < modulesInRow; col++) {
      // Calculate base position
      const x = bounds.getSouthWest().lng() + marginDeg + 
        (col * (moduleWidthDeg + marginDeg)) + (moduleWidthDeg / 2);
      const y = bounds.getSouthWest().lat() + marginDeg + 
        (row * (moduleHeightDeg + marginDeg)) + (moduleHeightDeg / 2);
      
      // Apply rotation around center
      const dx = x - center.lng();
      const dy = y - center.lat();
      const rotatedX = center.lng() + (dx * cos - dy * sin);
      const rotatedY = center.lat() + (dx * sin + dy * cos);
      
      const moduleCenter = new google.maps.LatLng(rotatedY, rotatedX);

      // Check if the module center is within the polygon
      if (google.maps.geometry.poly.containsLocation(moduleCenter, polygon)) {
        // Create module bounds with rotation
        const moduleBounds = {
          north: moduleCenter.lat() + ((moduleHeightDeg / 2) * cos),
          south: moduleCenter.lat() - ((moduleHeightDeg / 2) * cos),
          east: moduleCenter.lng() + ((moduleWidthDeg / 2) * cos),
          west: moduleCenter.lng() - ((moduleWidthDeg / 2) * cos)
        };

        const moduleRect = new google.maps.Rectangle({
          bounds: moduleBounds,
          map: map,
          fillColor: "#2563eb",
          fillOpacity: 0.4,
          strokeColor: "#1e40af",
          strokeWeight: 1
        });

        // Apply rotation to the rectangle
        moduleRect.setOptions({
          rotation: (primaryAngle * 180) / Math.PI
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