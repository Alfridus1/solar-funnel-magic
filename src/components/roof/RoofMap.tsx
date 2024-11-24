import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RoofMapUI } from "./components/RoofMapUI";
import { RoofAreaCalculator } from "./components/RoofAreaCalculator";
import { Instructions } from "./components/Instructions";
import { useRoofMapState } from "./hooks/useRoofMapState";
import { useRoofMapHandlers } from "./hooks/useRoofMapHandlers";
import { useModuleManagement } from "./hooks/useModuleManagement";
import { useRectangleCreation } from "./hooks/useRectangleCreation";

interface RoofMapProps {
  coordinates: { lat: number; lng: number };
  address: string;
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
}

export const RoofMap = ({ coordinates, address, onRoofOutlineComplete }: RoofMapProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const {
    map,
    setMap,
    polygons,
    setPolygons,
    modules,
    setModules,
    isDrawing,
    setIsDrawing,
    isAnalyzing,
    setIsAnalyzing,
    roofDetails,
    setRoofDetails
  } = useRoofMapState();

  const { clearModules, updateModules, addPolygonListeners } = useModuleManagement({
    map,
    polygons,
    modules,
    setModules,
    roofDetails,
    setRoofDetails,
    onRoofOutlineComplete,
    onLog: (message) => setDebugLog(prev => [...prev, message])
  });

  const { startDrawing, deleteLastRoof, onPolygonComplete } = useRoofMapHandlers({
    map,
    polygons,
    setPolygons,
    modules,
    setModules,
    isDrawing,
    setIsDrawing,
    roofDetails,
    setRoofDetails,
    onRoofOutlineComplete,
    setIsAnalyzing,
    toast,
    onLog: (message) => setDebugLog(prev => [...prev, message])
  });

  const { createRectangle } = useRectangleCreation({
    map,
    polygons,
    setPolygons,
    setModules,
    roofDetails,
    setRoofDetails,
    onRoofOutlineComplete,
    addPolygonListeners
  });

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    mapInstance.setZoom(19);
    mapInstance.setMapTypeId("satellite");
    mapInstance.setCenter(coordinates);
  }, [coordinates, setMap]);

  const handleContinue = () => {
    if (polygons.length === 0) {
      toast({
        title: "Keine Dachfläche eingezeichnet",
        description: "Bitte zeichnen Sie mindestens eine Dachfläche ein.",
        variant: "destructive",
      });
      return;
    }

    const allPaths = polygons.map(poly => poly.getPath().getArray());
    navigate("/solar-showcase", { 
      state: { 
        metrics: {
          roofArea: roofDetails.reduce((sum, detail) => sum + (detail.moduleCount * 1.7), 0),
          kWp: roofDetails.reduce((sum, detail) => sum + detail.kWp, 0),
          monthlyProduction: Math.round(roofDetails.reduce((sum, detail) => sum + detail.kWp, 0) * 1000 / 12),
          annualSavings: Math.round(roofDetails.reduce((sum, detail) => sum + detail.kWp, 0) * 1000 * 0.40),
          possiblePanels: roofDetails.reduce((sum, detail) => sum + detail.moduleCount, 0),
          roofDetails: roofDetails
        },
        address 
      }
    });
  };

  return (
    <div className="space-y-4 mb-8">
      <Instructions />
      
      <RoofMapUI
        coordinates={coordinates}
        isDrawing={isDrawing}
        isLoading={isLoading}
        onLoad={handleMapLoad}
        onPolygonComplete={onPolygonComplete}
        onStartDrawing={startDrawing}
        onDeleteLastRoof={deleteLastRoof}
        polygonsExist={polygons.length > 0}
        onStartRectangle={createRectangle}
      />

      {polygons.length > 0 && (
        <>
          <RoofAreaCalculator
            polygons={polygons}
          />
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleContinue}
              className="bg-solar-orange hover:bg-solar-orange-dark text-white px-8 py-3 text-lg"
            >
              Weiter zur Konfiguration
            </Button>
          </div>
        </>
      )}
    </div>
  );
};