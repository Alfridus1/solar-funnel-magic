import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRoofMapState } from "./hooks/useRoofMapState";
import { useRoofMapHandlers } from "./hooks/useRoofMapHandlers";
import { RoofMapUI } from "./components/RoofMapUI";
import { calculateModulePositions } from "./utils/moduleCalculations";

interface RoofMapProps {
  address: string;
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
  onLog?: (message: string) => void;
}

export const RoofMap = ({ address, onRoofOutlineComplete, onLog }: RoofMapProps) => {
  const [coordinates, setCoordinates] = useState({ lat: 52.520008, lng: 13.404954 });
  const [isLoading, setIsLoading] = useState(true);
  const [formattedAddress, setFormattedAddress] = useState("");
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

  const createRectangle = () => {
    if (!map) return;
    
    const center = map.getCenter();
    if (!center) return;
    
    const lat = center.lat();
    const lng = center.lng();
    
    // Erstelle ein rechteckiges Polygon
    const rectanglePoints = [
      { lat: lat + 0.0002, lng: lng - 0.0003 },
      { lat: lat + 0.0002, lng: lng + 0.0003 },
      { lat: lat - 0.0002, lng: lng + 0.0003 },
      { lat: lat - 0.0002, lng: lng - 0.0003 }
    ];
    
    const polygon = new google.maps.Polygon({
      paths: rectanglePoints,
      fillColor: "#2563eb",
      fillOpacity: 0.3,
      strokeColor: "#2563eb",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      editable: true,
      map: map
    });
    
    onPolygonComplete(polygon);
  };

  const geocodeAddress = useCallback(async () => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    try {
      onLog?.("Starte Geocoding für Adresse: " + address);
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address, region: 'DE' }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK && results) {
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
          lng: location.lng(),
        });
        setFormattedAddress(result[0].formatted_address);
        onLog?.(`Koordinaten gefunden: ${location.lat()}, ${location.lng()}`);
      }
    } catch (err: any) {
      const errorMessage = "Adresse konnte nicht gefunden werden";
      console.error(errorMessage, err);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: errorMessage
      });
      onLog?.(`Geocoding Fehler: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [address, toast, onLog]);

  useEffect(() => {
    geocodeAddress();
  }, [geocodeAddress]);

  useEffect(() => {
    if (map && formattedAddress) {
      const bounds = new window.google.maps.LatLngBounds();
      polygons.forEach(polygon => {
        polygon.getPath().forEach(latLng => {
          bounds.extend(latLng);
        });
      });
      
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      } else {
        map.setCenter(coordinates);
        map.setZoom(20);
      }
    }
  }, [map, polygons, formattedAddress, coordinates]);

  return (
    <RoofMapUI
      coordinates={coordinates}
      onLoad={(map) => {
        onLog?.("Karte wurde geladen");
        setMap(map);
      }}
      isDrawing={isDrawing}
      onPolygonComplete={onPolygonComplete}
      onStartDrawing={startDrawing}
      onDeleteLastRoof={deleteLastRoof}
      polygonsExist={polygons.length > 0}
      isLoading={isLoading}
      onStartRectangle={createRectangle}
    />
  );
};