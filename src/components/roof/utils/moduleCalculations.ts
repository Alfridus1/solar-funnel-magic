import { v4 as uuidv4 } from 'uuid';
import { MODULE_WIDTH, MODULE_HEIGHT, FRAME_MARGIN } from './constants';

export const calculateModulePositions = (
  polygon: google.maps.Polygon,
  map: google.maps.Map | null,
  setModules: (modules: google.maps.Rectangle[]) => void
) => {
  if (!map) return { moduleCount: 0, roofId: '' };

  const bounds = new google.maps.LatLngBounds();
  const path = polygon.getPath();
  path.forEach((point) => bounds.extend(point));

  const center = bounds.getCenter();
  const scale = 1 / Math.cos(center.lat() * Math.PI / 180);
  
  const panelWidthDeg = MODULE_WIDTH / 111320 * scale;
  const panelHeightDeg = MODULE_HEIGHT / 111320;
  const spacingDeg = FRAME_MARGIN / 111320;

  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const width = ne.lng() - sw.lng();
  const height = ne.lat() - sw.lat();

  const newModules: google.maps.Rectangle[] = [];
  const cols = Math.floor(width / (panelWidthDeg + spacingDeg));
  const rows = Math.floor(height / (panelHeightDeg + spacingDeg));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const position = new google.maps.LatLng(
        sw.lat() + row * (panelHeightDeg + spacingDeg),
        sw.lng() + col * (panelWidthDeg + spacingDeg)
      );

      // Check if module center is within polygon
      if (google.maps.geometry.poly.containsLocation(position, polygon)) {
        const moduleBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(
            position.lat(),
            position.lng()
          ),
          new google.maps.LatLng(
            position.lat() + panelHeightDeg,
            position.lng() + panelWidthDeg
          )
        );

        const module = new google.maps.Rectangle({
          bounds: moduleBounds,
          map: map,
          fillColor: "#FFD700",
          fillOpacity: 0.5,
          strokeColor: "#FFA500",
          strokeWeight: 1,
          clickable: false,
          zIndex: 1
        });

        newModules.push(module);
      }
    }
  }

  setModules(newModules);
  const roofId = uuidv4();
  // Calculate kWp based on module count (500Wp per module = 0.5 kWp per module)
  const kWp = Math.round(newModules.length * 0.5 * 2) / 2; // Round to nearest 0.5
  return { moduleCount: newModules.length, roofId, kWp };
};