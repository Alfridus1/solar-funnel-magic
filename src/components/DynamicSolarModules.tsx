import React, { useState, useEffect, useCallback } from 'react';
import { Camera, Square, Trash2 } from 'lucide-react';
import { MODULE_WIDTH, MODULE_HEIGHT, FRAME_MARGIN } from '@/components/roof/utils/constants';

const DynamicSolarModules = () => {
  const [polygons, setPolygons] = useState([]);
  const [modules, setModules] = useState([]);
  const [activePolygon, setActivePolygon] = useState(null);
  
  const calculateModuleGrid = useCallback((polygon) => {
    if (!polygon || polygon.points.length < 3) return [];
    
    // Calculate polygon bounding box
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

    // Calculate maximum number of modules
    const maxModulesX = Math.floor(width / (MODULE_WIDTH + FRAME_MARGIN));
    const maxModulesY = Math.floor(height / (MODULE_HEIGHT + FRAME_MARGIN));

    const newModules = [];
    
    // Create modules and check if they are inside the polygon
    for (let y = 0; y < maxModulesY; y++) {
      for (let x = 0; x < maxModulesX; x++) {
        const moduleX = bounds.minX + x * (MODULE_WIDTH + FRAME_MARGIN);
        const moduleY = bounds.minY + y * (MODULE_HEIGHT + FRAME_MARGIN);

        // Check all 4 corners of the module
        const corners = [
          { x: moduleX, y: moduleY },
          { x: moduleX + MODULE_WIDTH, y: moduleY },
          { x: moduleX + MODULE_WIDTH, y: moduleY + MODULE_HEIGHT },
          { x: moduleX, y: moduleY + MODULE_HEIGHT }
        ];

        // Only add module if all corners are inside the polygon
        if (corners.every(corner => isPointInPolygon(corner, polygon.points))) {
          newModules.push({
            id: `module-${x}-${y}`,
            x: moduleX,
            y: moduleY,
            width: MODULE_WIDTH,
            height: MODULE_HEIGHT
          });
        }
      }
    }

    return newModules;
  }, []);

  const isPointInPolygon = (point, polyPoints) => {
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

  // Add effect to update modules when polygons change
  useEffect(() => {
    if (activePolygon) {
      const updatedModules = calculateModuleGrid(activePolygon);
      setModules(updatedModules);
    }
  }, [activePolygon, calculateModuleGrid]);

  const handlePolygonMove = useCallback((polygonId, newPoints) => {
    setPolygons(current => 
      current.map(poly => 
        poly.id === polygonId 
          ? { ...poly, points: newPoints }
          : poly
      )
    );
    
    if (activePolygon?.id === polygonId) {
      const updatedModules = calculateModuleGrid({ points: newPoints });
      setModules(updatedModules);
    }
  }, [activePolygon, calculateModuleGrid]);

  const handlePolygonSelect = useCallback((polygon) => {
    setActivePolygon(polygon);
  }, []);

  // UI Components rendering
  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2"
          onClick={() => {/* Create rectangle polygon */}}
        >
          <Square className="w-4 h-4" />
          Rechteckiges Dach
        </button>
        
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2"
          onClick={() => {/* Create freehand polygon */}}
        >
          <Camera className="w-4 h-4" />
          Freiform Dach
        </button>
        
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center gap-2"
          onClick={() => {/* Delete active polygon */}}
        >
          <Trash2 className="w-4 h-4" />
          Letztes Dach entfernen
        </button>
      </div>

      {/* Map area with polygons and modules */}
      <div className="w-full h-full">
        {polygons.map(polygon => (
          <div 
            key={polygon.id} 
            className="absolute"
            onClick={() => handlePolygonSelect(polygon)}
          >
            {/* Polygon visualization */}
            <svg className="absolute top-0 left-0">
              <path
                d={`M ${polygon.points.map(p => `${p.x},${p.y}`).join(' L ')} Z`}
                fill={polygon.id === activePolygon?.id ? 'rgba(59, 130, 246, 0.5)' : 'rgba(209, 213, 219, 0.5)'}
                stroke="#2563EB"
                strokeWidth="2"
              />
            </svg>
          </div>
        ))}

        {/* Render modules */}
        {modules.map(module => (
          <div
            key={module.id}
            className="absolute border border-yellow-500 bg-yellow-400 bg-opacity-50"
            style={{
              left: `${module.x}px`,
              top: `${module.y}px`,
              width: `${module.width}px`,
              height: `${module.height}px`
            }}
          />
        ))}
      </div>

      {/* Information display */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <p className="font-medium">Module: {modules.length}</p>
        <p className="text-sm text-gray-600">
          Geschätzte Leistung: {(modules.length * 400).toLocaleString()} Wp
        </p>
      </div>
    </div>
  );
};

export default DynamicSolarModules;