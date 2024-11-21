import { v4 as uuidv4 } from 'uuid';

const PANEL_WIDTH = 1.7; // meters
const PANEL_HEIGHT = 1.0; // meters
const PANEL_SPACING = 0.3; // meters

// Hilfsfunktion zur Berechnung der Modulanzahl für eine bestimmte Rotation
const calculateModulesForRotation = (
  polygon: google.maps.Polygon,
  map: google.maps.Map | null,
  rotation: number
): number => {
  if (!map) return 0;

  const bounds = new google.maps.LatLngBounds();
  const path = polygon.getPath();
  path.forEach((point) => bounds.extend(point));

  // Convert panel dimensions to LatLng
  const center = bounds.getCenter();
  const scale = 1 / Math.cos(center.lat() * Math.PI / 180);
  
  // Adjust dimensions based on rotation
  const angleRad = rotation * (Math.PI / 180);
  const rotatedWidth = Math.abs(PANEL_WIDTH * Math.cos(angleRad)) + Math.abs(PANEL_HEIGHT * Math.sin(angleRad));
  const rotatedHeight = Math.abs(PANEL_WIDTH * Math.sin(angleRad)) + Math.abs(PANEL_HEIGHT * Math.cos(angleRad));
  
  const panelWidthDeg = rotatedWidth / 111320 * scale;
  const panelHeightDeg = rotatedHeight / 111320;
  const spacingDeg = PANEL_SPACING / 111320;

  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const width = ne.lng() - sw.lng();
  const height = ne.lat() - sw.lat();

  // Calculate grid dimensions
  const cols = Math.floor(width / (panelWidthDeg + spacingDeg));
  const rows = Math.floor(height / (panelHeightDeg + spacingDeg));

  let moduleCount = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const position = new google.maps.LatLng(
        sw.lat() + row * (panelHeightDeg + spacingDeg),
        sw.lng() + col * (panelWidthDeg + spacingDeg)
      );

      if (google.maps.geometry.poly.containsLocation(position, polygon)) {
        moduleCount++;
      }
    }
  }

  return moduleCount;
};

// Funktion zur Findung der optimalen Rotation
export const findOptimalRotation = (
  polygon: google.maps.Polygon,
  map: google.maps.Map | null
): number => {
  let maxModules = 0;
  let optimalRotation = 0;

  // Überprüfe Rotationen in 5-Grad-Schritten
  for (let rotation = 0; rotation < 180; rotation += 5) {
    const moduleCount = calculateModulesForRotation(polygon, map, rotation);
    if (moduleCount > maxModules) {
      maxModules = moduleCount;
      optimalRotation = rotation;
    }
  }

  return optimalRotation;
};

export const calculateModulePositions = (
  polygon: google.maps.Polygon,
  map: google.maps.Map | null,
  setModules: (modules: google.maps.Rectangle[]) => void,
  rotation: number = 0
) => {
  if (!map) return { moduleCount: 0, roofId: '' };

  // Lösche bestehende Module
  setModules([]);

  const bounds = new google.maps.LatLngBounds();
  const path = polygon.getPath();
  path.forEach((point) => bounds.extend(point));

  const center = bounds.getCenter();
  const scale = 1 / Math.cos(center.lat() * Math.PI / 180);
  
  const angleRad = rotation * (Math.PI / 180);
  const rotatedWidth = Math.abs(PANEL_WIDTH * Math.cos(angleRad)) + Math.abs(PANEL_HEIGHT * Math.sin(angleRad));
  const rotatedHeight = Math.abs(PANEL_WIDTH * Math.sin(angleRad)) + Math.abs(PANEL_HEIGHT * Math.cos(angleRad));
  
  const panelWidthDeg = rotatedWidth / 111320 * scale;
  const panelHeightDeg = rotatedHeight / 111320;
  const spacingDeg = PANEL_SPACING / 111320;

  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const width = ne.lng() - sw.lng();
  const height = ne.lat() - sw.lat();

  const modules: google.maps.Rectangle[] = [];
  const projection = map.getProjection();
  if (!projection) return { moduleCount: 0, roofId: '' };

  const cols = Math.floor(width / (panelWidthDeg + spacingDeg));
  const rows = Math.floor(height / (panelHeightDeg + spacingDeg));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const position = new google.maps.LatLng(
        sw.lat() + row * (panelHeightDeg + spacingDeg),
        sw.lng() + col * (panelWidthDeg + spacingDeg)
      );

      if (google.maps.geometry.poly.containsLocation(position, polygon)) {
        const modulePoints = [
          { lat: position.lat(), lng: position.lng() },
          { lat: position.lat() + panelHeightDeg, lng: position.lng() },
          { lat: position.lat() + panelHeightDeg, lng: position.lng() + panelWidthDeg },
          { lat: position.lat(), lng: position.lng() + panelWidthDeg }
        ];

        const centerPoint = {
          lat: position.lat() + panelHeightDeg / 2,
          lng: position.lng() + panelWidthDeg / 2
        };

        const rotatedPoints = modulePoints.map(point => {
          const dx = point.lng - centerPoint.lng;
          const dy = point.lat - centerPoint.lat;
          const rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
          const rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
          return {
            lat: centerPoint.lat + rotatedY,
            lng: centerPoint.lng + rotatedX
          };
        });

        const module = new google.maps.Rectangle({
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(
              Math.min(...rotatedPoints.map(p => p.lat)),
              Math.min(...rotatedPoints.map(p => p.lng))
            ),
            new google.maps.LatLng(
              Math.max(...rotatedPoints.map(p => p.lat)),
              Math.max(...rotatedPoints.map(p => p.lng))
            )
          ),
          map: map,
          fillColor: "#FFD700",
          fillOpacity: 0.5,
          strokeColor: "#FFA500",
          strokeWeight: 1,
          clickable: false,
          zIndex: 1
        });

        modules.push(module);
      }
    }
  }

  setModules(modules);
  const roofId = uuidv4();
  return { moduleCount: modules.length, roofId };
};