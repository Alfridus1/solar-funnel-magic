import React, { useState } from 'react';
import { Square, Move, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface RoofDesignerProps {
  onComplete?: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
}

export const RoofDesigner = ({ onComplete }: RoofDesignerProps) => {
  const [polygons, setPolygons] = useState<Array<{
    id: string;
    type: 'rectangle';
    points: Array<{ x: number; y: number }>;
  }>>([]);
  const [activePolygonId, setActivePolygonId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Pattern-Definitionen für Solarmodule
  const PATTERN_SIZE = 100; // Größe eines Moduls in Pixeln
  const PATTERN_GAP = 5; // Abstand zwischen Modulen

  const calculateTotalModules = () => {
    let totalModules = 0;
    const roofDetails = polygons.map(polygon => {
      const moduleCount = Math.floor((
        (Math.abs((polygon.points[1].x - polygon.points[0].x) * 
                 (polygon.points[2].y - polygon.points[1].y))) /
        ((PATTERN_SIZE + PATTERN_GAP) * (PATTERN_SIZE + PATTERN_GAP))
      ));
      totalModules += moduleCount;
      return {
        roofId: polygon.id,
        moduleCount
      };
    });
    return { totalModules, roofDetails };
  };

  const handleAddRoof = () => {
    const newPolygon = {
      id: Date.now().toString(),
      type: 'rectangle' as const,
      points: [
        { x: 200, y: 200 },
        { x: 400, y: 200 },
        { x: 400, y: 400 },
        { x: 200, y: 400 }
      ]
    };
    setPolygons([...polygons, newPolygon]);
    setActivePolygonId(newPolygon.id);
    
    const { totalModules } = calculateTotalModules();
    toast({
      title: "Dachfläche hinzugefügt",
      description: `${totalModules} Module können auf den Dachflächen installiert werden.`,
      duration: 3000,
    });
  };

  const handleDeleteRoof = () => {
    if (!activePolygonId) return;
    
    setPolygons(polygons.filter(p => p.id !== activePolygonId));
    setActivePolygonId(null);
    
    const { totalModules } = calculateTotalModules();
    toast({
      title: "Dachfläche entfernt",
      description: `${totalModules} Module können auf den verbleibenden Dachflächen installiert werden.`,
      duration: 3000,
    });
  };

  const handleComplete = () => {
    if (polygons.length === 0) {
      toast({
        title: "Keine Dachflächen",
        description: "Bitte zeichnen Sie mindestens eine Dachfläche ein.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const { roofDetails } = calculateTotalModules();
    if (onComplete) {
      onComplete([], roofDetails);
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg border border-gray-200">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          variant="default"
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleAddRoof}
        >
          <Square className="w-4 h-4 mr-2" />
          Rechteckiges Dach
        </Button>

        <Button
          variant="destructive"
          onClick={handleDeleteRoof}
          disabled={!activePolygonId}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Dach entfernen
        </Button>
      </div>

      {/* SVG-Zeichenfläche */}
      <svg className="w-full h-full">
        <defs>
          <pattern 
            id="solarPattern" 
            width={PATTERN_SIZE + PATTERN_GAP} 
            height={PATTERN_SIZE + PATTERN_GAP} 
            patternUnits="userSpaceOnUse"
          >
            <rect
              x={PATTERN_GAP / 2}
              y={PATTERN_GAP / 2}
              width={PATTERN_SIZE}
              height={PATTERN_SIZE}
              fill="#ffd700"
              fillOpacity="0.7"
              stroke="#ff8c00"
              strokeWidth="2"
            />
          </pattern>
        </defs>

        {polygons.map((polygon) => {
          const pathD = `M ${polygon.points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
          
          return (
            <g key={polygon.id}>
              <path
                d={pathD}
                fill="#4a5568"
                fillOpacity="0.2"
                stroke="#2d3748"
                strokeWidth="2"
              />
              
              <path
                d={pathD}
                fill="url(#solarPattern)"
                strokeWidth="2"
                className="transition-all duration-200"
                style={{ cursor: 'move' }}
                onClick={() => setActivePolygonId(polygon.id)}
              />

              {polygon.id === activePolygonId && polygon.points.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="white"
                  stroke="#3182ce"
                  strokeWidth="2"
                  cursor="move"
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const originalX = point.x;
                    const originalY = point.y;
                    
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const dx = moveEvent.clientX - startX;
                      const dy = moveEvent.clientY - startY;
                      
                      const newPolygons = polygons.map(p => {
                        if (p.id === polygon.id) {
                          const newPoints = [...p.points];
                          newPoints[index] = {
                            x: originalX + dx,
                            y: originalY + dy
                          };
                          return { ...p, points: newPoints };
                        }
                        return p;
                      });
                      
                      setPolygons(newPolygons);
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Info-Panel */}
      {activePolygonId && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Move className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              Ziehen Sie die weißen Punkte, um die Form anzupassen
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Die Solarmodule passen sich automatisch an
          </p>
        </div>
      )}

      {/* Weiter-Button */}
      {polygons.length > 0 && (
        <div className="absolute bottom-4 left-4">
          <Button 
            onClick={handleComplete}
            className="bg-solar-orange hover:bg-solar-orange-dark"
          >
            Weiter zur Konfiguration
          </Button>
        </div>
      )}
    </div>
  );
};