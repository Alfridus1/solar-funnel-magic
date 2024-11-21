import React, { useState, useEffect, useCallback } from 'react';
import { Camera, Square, Trash2, RotateCcw } from 'lucide-react';
import { MODULE_WIDTH, MODULE_HEIGHT, FRAME_MARGIN } from '@/components/roof/utils/constants';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const DynamicSolarModules = () => {
  const [polygons, setPolygons] = useState([]);
  const [modules, setModules] = useState([]);
  const [activePolygon, setActivePolygon] = useState(null);
  const [moduleRotation, setModuleRotation] = useState(0); // 0 = horizontal, 90 = vertical
  const [isManualPlacement, setIsManualPlacement] = useState(false);
  
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

    // Use rotated dimensions based on moduleRotation
    const effectiveModuleWidth = moduleRotation === 90 ? MODULE_HEIGHT : MODULE_WIDTH;
    const effectiveModuleHeight = moduleRotation === 90 ? MODULE_WIDTH : MODULE_HEIGHT;

    // Calculate maximum number of modules with safety margin
    const maxModulesX = Math.floor((width - FRAME_MARGIN) / (effectiveModuleWidth + FRAME_MARGIN));
    const maxModulesY = Math.floor((height - FRAME_MARGIN) / (effectiveModuleHeight + FRAME_MARGIN));

    const newModules = [];
    
    // Create modules and check if they are inside the polygon
    for (let y = 0; y < maxModulesY; y++) {
      for (let x = 0; x < maxModulesX; x++) {
        const moduleX = bounds.minX + FRAME_MARGIN + x * (effectiveModuleWidth + FRAME_MARGIN);
        const moduleY = bounds.minY + FRAME_MARGIN + y * (effectiveModuleHeight + FRAME_MARGIN);

        // Check all corners and center points of the module
        const corners = [
          { x: moduleX, y: moduleY },
          { x: moduleX + effectiveModuleWidth, y: moduleY },
          { x: moduleX + effectiveModuleWidth, y: moduleY + effectiveModuleHeight },
          { x: moduleX, y: moduleY + effectiveModuleHeight },
          { x: moduleX + effectiveModuleWidth/2, y: moduleY + effectiveModuleHeight/2 } // Center point
        ];

        // Only add module if all test points are inside the polygon
        if (corners.every(corner => isPointInPolygon(corner, polygon.points))) {
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
  }, [moduleRotation]);

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
    if (!isManualPlacement) {
      const allModules = [];
      polygons.forEach(polygon => {
        const polygonModules = calculateModuleGrid(polygon);
        allModules.push(...polygonModules);
      });
      setModules(allModules);
    }
  }, [polygons, calculateModuleGrid, moduleRotation, isManualPlacement]);

  const handlePolygonMove = useCallback((polygonId, newPoints) => {
    setPolygons(current => 
      current.map(poly => 
        poly.id === polygonId 
          ? { ...poly, points: newPoints }
          : poly
      )
    );
  }, []);

  const handlePolygonSelect = useCallback((polygon) => {
    setActivePolygon(polygon);
  }, []);

  const handleRotationChange = useCallback((newRotation) => {
    setModuleRotation(newRotation);
  }, []);

  const togglePlacementMode = useCallback(() => {
    setIsManualPlacement(prev => !prev);
    if (!isManualPlacement) {
      setModules([]); // Clear existing modules when entering manual mode
    }
  }, [isManualPlacement]);

  const handleManualPlacement = useCallback((e) => {
    if (!isManualPlacement || !activePolygon) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const effectiveModuleWidth = moduleRotation === 90 ? MODULE_HEIGHT : MODULE_WIDTH;
    const effectiveModuleHeight = moduleRotation === 90 ? MODULE_WIDTH : MODULE_HEIGHT;

    // Check if the new module would be inside the polygon
    const moduleCorners = [
      { x, y },
      { x: x + effectiveModuleWidth, y },
      { x: x + effectiveModuleWidth, y: y + effectiveModuleHeight },
      { x, y: y + effectiveModuleHeight }
    ];

    if (moduleCorners.every(corner => isPointInPolygon(corner, activePolygon.points))) {
      setModules(prev => [...prev, {
        id: `manual-module-${Date.now()}`,
        x,
        y,
        width: effectiveModuleWidth,
        height: effectiveModuleHeight,
        polygonId: activePolygon.id
      }]);
    }
  }, [isManualPlacement, activePolygon, moduleRotation]);

  // Calculate statistics per polygon
  const roofStats = polygons.map(polygon => {
    const roofModules = modules.filter(m => m.polygonId === polygon.id);
    return {
      id: polygon.id,
      moduleCount: roofModules.length,
      power: roofModules.length * 400 // 400Wp per module
    };
  });

  const totalPower = roofStats.reduce((sum, stat) => sum + stat.power, 0);
  const totalModules = roofStats.reduce((sum, stat) => sum + stat.moduleCount, 0);

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => {/* Create rectangle polygon */}}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Square className="w-4 h-4 mr-2" />
            Rechteckiges Dach
          </Button>
          
          <Button
            variant="default"
            onClick={() => {/* Create freehand polygon */}}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Camera className="w-4 h-4 mr-2" />
            Freiform Dach
          </Button>
          
          <Button
            variant="destructive"
            onClick={() => {/* Delete active polygon */}}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Letztes Dach entfernen
          </Button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <RotateCcw className="w-4 h-4" />
            <span>Modulausrichtung</span>
          </div>
          <Slider
            value={[moduleRotation]}
            onValueChange={([value]) => handleRotationChange(value)}
            max={90}
            step={90}
            className="w-48"
          />
        </div>

        <Button
          variant="outline"
          onClick={togglePlacementMode}
          className={isManualPlacement ? "bg-green-100" : ""}
        >
          {isManualPlacement ? "Automatische Platzierung" : "Manuelle Platzierung"}
        </Button>
      </div>

      {/* Map area with polygons and modules */}
      <div 
        className="w-full h-full"
        onClick={handleManualPlacement}
      >
        {polygons.map(polygon => (
          <div 
            key={polygon.id} 
            className="absolute"
            onClick={(e) => {
              e.stopPropagation();
              handlePolygonSelect(polygon);
            }}
          >
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

        {modules.map(module => (
          <div
            key={module.id}
            className="absolute border border-yellow-500 bg-yellow-400 bg-opacity-50"
            style={{
              left: `${module.x}px`,
              top: `${module.y}px`,
              width: `${module.width}px`,
              height: `${module.height}px`,
              transform: `rotate(${moduleRotation}deg)`,
              transformOrigin: 'top left'
            }}
          />
        ))}
      </div>

      {/* Information display */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg space-y-4">
        <div>
          <h3 className="font-bold mb-2">Gesamtübersicht:</h3>
          <p className="font-medium">Gesamt Module: {totalModules}</p>
          <p className="text-sm text-gray-600">
            Gesamtleistung: {totalPower.toLocaleString()} Wp
          </p>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-bold mb-2">Details pro Dach:</h3>
          <div className="space-y-2">
            {roofStats.map((stat, index) => (
              <div key={stat.id} className="text-sm">
                <p className="font-medium">Dach {index + 1}:</p>
                <p className="text-gray-600">{stat.moduleCount} Module ({stat.power.toLocaleString()} Wp)</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicSolarModules;