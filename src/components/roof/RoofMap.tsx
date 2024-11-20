import { useState, useCallback } from "react";
import { GoogleMap, DrawingManager } from "@react-google-maps/api";
import { useToast } from "@/components/ui/use-toast";
import { Instructions } from "./components/Instructions";
import { MapControls } from "./components/MapControls";
import { calculateModulePositions } from "./utils/moduleCalculations";
import { Loader2 } from "lucide-react";
import { RoofMapUI } from "./components/RoofMapUI";
import { useRoofMapHandlers } from "./hooks/useRoofMapHandlers";
import { useRoofMapState } from "./hooks/useRoofMapState";

interface RoofMapProps {
  coordinates: { lat: number; lng: number };
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
  onLog?: (message: string) => void;
}

export const RoofMap = ({ coordinates, onRoofOutlineComplete, onLog }: RoofMapProps) => {
  const { toast } = useToast();
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

  const {
    handleAutoDetect,
    clearModules,
    startDrawing,
    deleteLastRoof,
    onPolygonComplete
  } = useRoofMapHandlers({
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
    onLog
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    onLog?.("Karte geladen, starte automatische Analyse");
    setMap(map);
    handleAutoDetect(map);
  }, [handleAutoDetect, setMap, onLog]);

  return (
    <div className="space-y-4">
      <Instructions />
      <RoofMapUI
        isAnalyzing={isAnalyzing}
        coordinates={coordinates}
        onLoad={onLoad}
        isDrawing={isDrawing}
        onPolygonComplete={onPolygonComplete}
      />
      <MapControls
        isDrawing={isDrawing}
        polygonsExist={polygons.length > 0}
        onStartDrawing={startDrawing}
        onDeleteLastRoof={deleteLastRoof}
      />
    </div>
  );
};