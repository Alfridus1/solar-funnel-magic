import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Instructions } from "./components/Instructions";
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
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 49.5316,
    lng: 8.3491
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }
      
      try {
        const geocoder = new google.maps.Geocoder();
        const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results) {
              resolve(results);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });

        if (result[0]?.geometry?.location) {
          const location = result[0].geometry.location;
          setCoordinates({
            lat: location.lat(),
            lng: location.lng()
          });
          onLog?.(`Koordinaten gefunden: ${location.lat()}, ${location.lng()}`);
        }
      } catch (err) {
        const errorMessage = "Adresse konnte nicht gefunden werden";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Fehler",
          description: errorMessage
        });
        onLog?.(`Geocoding Fehler: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    geocodeAddress();
  }, [address, toast, onLog]);

  const onLoad = useCallback((map: google.maps.Map) => {
    onLog?.("Karte geladen");
    setMap(map);
    setIsLoading(false);
  }, [setMap, onLog]);

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <Instructions />
      <RoofMapUI
        coordinates={coordinates}
        onLoad={onLoad}
        isDrawing={isDrawing}
        onPolygonComplete={onPolygonComplete}
        onStartDrawing={startDrawing}
        onDeleteLastRoof={deleteLastRoof}
        polygonsExist={polygons.length > 0}
        isLoading={isLoading}
      />
    </div>
  );
};