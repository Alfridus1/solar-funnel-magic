import { MODULE_WIDTH, MODULE_HEIGHT, FRAME_MARGIN } from '@/components/roof/utils/constants';

export const isPointInPolygon = (point: {x: number, y: number}, polyPoints: {x: number, y: number}[]) => {
  let inside = false;
  for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    const xi = polyPoints[i].x;
    const yi = polyPoints[i].y;
    const xj = polyPoints[j].x;
    const yj = polyPoints[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

export const calculateModuleGrid = (
  polygon: { points: {x: number, y: number}[], id: string } | null,
  moduleRotation: number
) => {
  if (!polygon || polygon.points.length < 3) return [];
  
  const bounds = polygon.points.reduce((acc, point) => ({
    minX: Math.min(acc.minX, point.x),
    minY: Math.min(acc.minY, point.y),
    maxX: Math.max(acc.maxX, point.x),
    maxY: Math.max(acc.maxY, point.y)
  }), {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  });

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  const effectiveModuleWidth = moduleRotation === 90 ? MODULE_HEIGHT : MODULE_WIDTH;
  const effectiveModuleHeight = moduleRotation === 90 ? MODULE_WIDTH : MODULE_HEIGHT;

  const maxModulesX = Math.floor((width - FRAME_MARGIN) / (effectiveModuleWidth + FRAME_MARGIN));
  const maxModulesY = Math.floor((height - FRAME_MARGIN) / (effectiveModuleHeight + FRAME_MARGIN));

  const newModules = [];
  
  for (let y = 0; y < maxModulesY; y++) {
    for (let x = 0; x < maxModulesX; x++) {
      const moduleX = bounds.minX + FRAME_MARGIN + x * (effectiveModuleWidth + FRAME_MARGIN);
      const moduleY = bounds.minY + FRAME_MARGIN + y * (effectiveModuleHeight + FRAME_MARGIN);

      // Überprüfe alle Ecken und zusätzliche Punkte entlang der Kanten
      const testPoints = [
        { x: moduleX, y: moduleY }, // Obere linke Ecke
        { x: moduleX + effectiveModuleWidth, y: moduleY }, // Obere rechte Ecke
        { x: moduleX + effectiveModuleWidth, y: moduleY + effectiveModuleHeight }, // Untere rechte Ecke
        { x: moduleX, y: moduleY + effectiveModuleHeight }, // Untere linke Ecke
        { x: moduleX + effectiveModuleWidth/2, y: moduleY }, // Oben Mitte
        { x: moduleX + effectiveModuleWidth, y: moduleY + effectiveModuleHeight/2 }, // Rechts Mitte
        { x: moduleX + effectiveModuleWidth/2, y: moduleY + effectiveModuleHeight }, // Unten Mitte
        { x: moduleX, y: moduleY + effectiveModuleHeight/2 }, // Links Mitte
        { x: moduleX + effectiveModuleWidth/2, y: moduleY + effectiveModuleHeight/2 } // Zentrum
      ];

      if (testPoints.every(point => isPointInPolygon(point, polygon.points))) {
        newModules.push({
          id: `module-${x}-${y}`,
          x: moduleX,
          y: moduleY,
          width: effectiveModuleWidth,
          height: effectiveModuleHeight,
          polygonId: polygon.id
        });
      }
    }
  }

  return newModules;
};