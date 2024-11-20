import { useState, useCallback } from "react";
import { GoogleMap, DrawingManager } from "@react-google-maps/api";
import { useToast } from "@/components/ui/use-toast";
import { Instructions } from "./components/Instructions";
import { MapControls } from "./components/MapControls";
import { calculateModulePositions } from "./utils/moduleCalculations";
import { RoofMapUI } from "./components/RoofMapUI";
import { useRoofMapHandlers } from "./hooks/useRoofMapHandlers";
import { useRoofMapState } from "./hooks/useRoofMapState";

interface RoofMapProps {
  address: string;
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
  onLog?: (message: string) => void;
}

export const RoofMap = ({ address, onRoofOutlineComplete, onLog }: RoofMapProps) => {
  const { toast } = useToast();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
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

  // Geocode the address to get coordinates
  useState(() => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        const location = results[0].geometry.location;
        setCoordinates({
          lat: location.lat(),
          lng: location.lng()
        });
      }
    });
  }, [address]);

  const onLoad = useCallback((map: google.maps.Map) => {
    onLog?.("Karte geladen");
    setMap(map);
  }, [setMap, onLog]);

  if (!coordinates) {
    return <div>Lade Kartenposition...</div>;
  }

  return (
    <div className="space-y-4">
      <Instructions />
      <RoofMapUI
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