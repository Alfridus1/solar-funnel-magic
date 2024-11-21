import React, { useState, useEffect, useCallback } from 'react';
import { ModuleControls } from '@/components/roof/modules/ModuleControls';
import { ModuleStats } from '@/components/roof/modules/ModuleStats';
import { calculateModuleGrid, isPointInPolygon } from '@/components/roof/modules/ModuleCalculator';
import { MODULE_WIDTH, MODULE_HEIGHT } from '@/components/roof/utils/constants';
import { useToast } from "@/components/ui/use-toast";

const DynamicSolarModules = () => {
  const [polygons, setPolygons] = useState([]);
  const [modules, setModules] = useState([]);
  const [activePolygon, setActivePolygon] = useState(null);
  const [moduleRotation, setModuleRotation] = useState(0);
  const [isManualPlacement, setIsManualPlacement] = useState(false);
  const { toast } = useToast();

  const recalculateAllModules = useCallback(() => {
    if (!isManualPlacement) {
      const newModules = [];
      polygons.forEach(polygon => {
        const polygonModules = calculateModuleGrid(polygon, moduleRotation);
        newModules.push(...polygonModules);
      });
      setModules(newModules);

      if (newModules.length > 0) {
        toast({
          title: "Module berechnet",
          description: `${newModules.length} Module können optimal auf den Dachflächen installiert werden.`,
          duration: 3000,
        });
      }
    }
  }, [polygons, moduleRotation, isManualPlacement, toast]);

  useEffect(() => {
    recalculateAllModules();
  }, [recalculateAllModules]);

  const handlePolygonMove = useCallback((polygonId, newPoints) => {
    setPolygons(current => 
      current.map(poly => 
        poly.id === polygonId 
          ? { ...poly, points: newPoints }
          : poly
      )
    );
    recalculateAllModules();
  }, [recalculateAllModules]);

  const handlePolygonSelect = useCallback((polygon) => {
    setActivePolygon(polygon);
  }, []);

  const handleRotationChange = useCallback((newRotation) => {
    setModuleRotation(newRotation);
  }, []);

  const togglePlacementMode = useCallback(() => {
    setIsManualPlacement(prev => !prev);
    if (!isManualPlacement) {
      setModules([]);
    } else {
      recalculateAllModules();
    }
  }, [isManualPlacement, recalculateAllModules]);

  const handleManualPlacement = useCallback((e) => {
    if (!isManualPlacement || !activePolygon) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const effectiveModuleWidth = moduleRotation === 90 ? MODULE_HEIGHT : MODULE_WIDTH;
    const effectiveModuleHeight = moduleRotation === 90 ? MODULE_WIDTH : MODULE_HEIGHT;

    const moduleCorners = [
      { x, y },
      { x: x + effectiveModuleWidth, y },
      { x: x + effectiveModuleWidth, y: y + effectiveModuleHeight },
      { x, y: y + effectiveModuleHeight }
    ];

    if (moduleCorners.every(corner => isPointInPolygon(corner, activePolygon.points))) {
      const newModule = {
        id: `manual-module-${Date.now()}`,
        x,
        y,
        width: effectiveModuleWidth,
        height: effectiveModuleHeight,
        polygonId: activePolygon.id
      };

      setModules(prev => [...prev, newModule]);
    }
  }, [isManualPlacement, activePolygon, moduleRotation]);

  const roofStats = polygons.map(polygon => {
    const roofModules = modules.filter(m => m.polygonId === polygon.id);
    return {
      id: polygon.id,
      moduleCount: roofModules.length,
      power: roofModules.length * 400
    };
  });

  return (
    <div className="relative w-full h-screen bg-gray-100">
      <ModuleControls
        onRotationChange={handleRotationChange}
        moduleRotation={moduleRotation}
        isManualPlacement={isManualPlacement}
        onTogglePlacement={togglePlacementMode}
      />

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

      <ModuleStats roofStats={roofStats} />
    </div>
  );
};

export default DynamicSolarModules;