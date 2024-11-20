import { v4 as uuidv4 } from 'uuid';

const PANEL_WIDTH = 1.7; // meters
const PANEL_HEIGHT = 1.0; // meters
const PANEL_SPACING = 0.3; // meters

export const calculateModulePositions = (
  polygon: google.maps.Polygon,
  map: google.maps.Map | null,
  setModules: (modules: google.maps.Rectangle[]) => void
) => {
  if (!map) return { moduleCount: 0, roofId: '' };

  const bounds = new google.maps.LatLngBounds();
  const path = polygon.getPath();
  path.forEach((point) => bounds.extend(point));

  // Calculate the main angle of the roof
  const points = path.getArray();
  let maxDistance = 0;
  let mainVector = { x: 0, y: 0 };

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    
    const dx = p2.lng() - p1.lng();
    const dy = p2.lat() - p1.lat();
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxDistance) {
      maxDistance = distance;
      mainVector = { x: dx, y: dy };
    }
  }

  const angle = Math.atan2(mainVector.y, mainVector.x) * (180 / Math.PI);

  // Convert panel dimensions to LatLng
  const center = bounds.getCenter();
  const scale = 1 / Math.cos(center.lat() * Math.PI / 180);
  const panelWidthDeg = PANEL_WIDTH / 111320 * scale;
  const panelHeightDeg = PANEL_HEIGHT / 111320;
  const spacingDeg = PANEL_SPACING / 111320;

  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const width = ne.lng() - sw.lng();
  const height = ne.lat() - sw.lat();

  const modules: google.maps.Rectangle[] = [];
  const projection = map.getProjection();
  if (!projection) return { moduleCount: 0, roofId: '' };

  // Calculate grid dimensions
  const cols = Math.floor(width / (panelWidthDeg + spacingDeg));
  const rows = Math.floor(height / (panelHeightDeg + spacingDeg));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const position = new google.maps.LatLng(
        sw.lat() + row * (panelHeightDeg + spacingDeg),
        sw.lng() + col * (panelWidthDeg + spacingDeg)
      );

      if (google.maps.geometry.poly.containsLocation(position, polygon)) {
        const module = new google.maps.Rectangle({
          bounds: new google.maps.LatLngBounds(
            position,
            new google.maps.LatLng(
              position.lat() + panelHeightDeg,
              position.lng() + panelWidthDeg
            )
          ),
          map: map,
          fillColor: "#FFD700",
          fillOpacity: 0.5,
          strokeColor: "#FFA500",
          strokeWeight: 1,
          clickable: false
        });

        modules.push(module);
      }
    }
  }

  setModules(modules);
  const roofId = uuidv4();
  return { moduleCount: modules.length, roofId };
};