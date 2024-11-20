import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Instructions } from "./components/Instructions";
import { RoofMapUI } from "./components/RoofMapUI";
import { useRoofMapHandlers } from "./hooks/useRoofMapHandlers";
import { useRoofMapState } from "./hooks/useRoofMapState";
import { Loader2 } from "lucide-react";

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
  const [formattedAddress, setFormattedAddress] = useState(address);

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
            if (status === "OK" && results && results.length > 0) {
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
          setFormattedAddress(result[0].formatted_address);
          onLog?.(`Koordinaten gefunden: ${location.lat()}, ${location.lng()}`);
          setIsLoading(false);
        }
      } catch (err: any) {
        const errorMessage = "Adresse konnte nicht gefunden werden";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Fehler",
          description: errorMessage
        });
        onLog?.(`Geocoding Fehler: ${err.message}`);
        setIsLoading(false);
      }
    };

    if (address) {
      geocodeAddress();
    }
  }, [address, toast, onLog]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-red-600 text-center">
          <p className="font-semibold mb-2">Fehler beim Laden der Karte</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-gray-600">Lade Kartenposition...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Ausgewählte Adresse</h2>
        <p className="text-gray-700">{formattedAddress || address}</p>
      </div>
      <Instructions />
      <RoofMapUI
        coordinates={coordinates}
        onLoad={(map) => {
          setMap(map);
          setIsLoading(false);
        }}
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