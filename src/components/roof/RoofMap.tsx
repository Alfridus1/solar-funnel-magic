import { useState, useCallback } from "react";
import { GoogleMap, DrawingManager } from "@react-google-maps/api";
import { useToast } from "@/components/ui/use-toast";
import { Instructions } from "./components/Instructions";
import { MapControls } from "./components/MapControls";
import { calculateModulePositions } from "./utils/moduleCalculations";
import { Loader2 } from "lucide-react";

interface RoofMapProps {
  coordinates: { lat: number; lng: number };
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
}

export const RoofMap = ({ coordinates, onRoofOutlineComplete }: RoofMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [modules, setModules] = useState<google.maps.Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roofDetails, setRoofDetails] = useState<{ roofId: string; moduleCount: number }[]>([]);
  const { toast } = useToast();

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // Start automatic analysis when map loads
    handleAutoDetect(map);
  }, []);

  const handleAutoDetect = async (mapInstance: google.maps.Map) => {
    setIsAnalyzing(true);
    try {
      // Get the current map bounds and zoom level
      const bounds = mapInstance.getBounds();
      const zoom = mapInstance.getZoom();
      if (!bounds) return;

      // Get the static map image URL
      const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=${zoom}&size=640x640&maptype=satellite&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

      // Call the Supabase Edge Function
      const response = await fetch('/functions/v1/analyze-roof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          location: {
            lat: coordinates.lat,
            lng: coordinates.lng,
            zoom: zoom
          }
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Create a polygon from the detected coordinates
      if (data.coordinates && data.coordinates.length > 0) {
        const path = data.coordinates.map((coord: number[]) => ({
          lat: coord[0],
          lng: coord[1]
        }));

        const polygon = new google.maps.Polygon({
          paths: path,
          strokeColor: "#2563eb",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#2563eb",
          fillOpacity: 0.35,
          editable: true,
          map: mapInstance
        });

        setPolygons(prev => [...prev, polygon]);
        const { moduleCount, roofId } = calculateModulePositions(polygon, mapInstance, setModules);
        
        const newRoofDetails = [...roofDetails, { roofId, moduleCount }];
        setRoofDetails(newRoofDetails);

        const allPaths = [...polygons, polygon].map(poly =>
          poly.getPath().getArray()
        );
        onRoofOutlineComplete(allPaths, newRoofDetails);

        toast({
          title: "Dach erfolgreich erkannt",
          description: "Die Dachfläche wurde automatisch erkannt. Sie können die Form bei Bedarf anpassen.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error during roof detection:', error);
      toast({
        title: "Automatische Erkennung fehlgeschlagen",
        description: "Bitte zeichnen Sie die Dachfläche manuell ein.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearModules = () => {
    modules.forEach((module) => module.setMap(null));
    setModules([]);
  };

  const startDrawing = () => {
    setIsDrawing(true);
    clearModules();
    toast({
      title: "Zeichenmodus aktiviert",
      description: "Klicken Sie nacheinander auf die Ecken Ihres Daches. Klicken Sie zum Abschluss auf den ersten Punkt zurück.",
      duration: 5000,
    });
  };

  const deleteLastRoof = () => {
    if (polygons.length > 0) {
      const lastPolygon = polygons[polygons.length - 1];
      lastPolygon.setMap(null);
      setPolygons((prev) => prev.slice(0, -1));
      
      const updatedRoofDetails = roofDetails.slice(0, -1);
      setRoofDetails(updatedRoofDetails);
      clearModules();

      const allPaths = polygons.slice(0, -1).map((poly) => poly.getPath().getArray());
      onRoofOutlineComplete(allPaths, updatedRoofDetails);

      toast({
        title: "Dach entfernt",
        description: "Das zuletzt gezeichnete Dach wurde entfernt.",
        duration: 3000,
      });
    }
  };

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    setPolygons((prev) => [...prev, polygon]);
    setIsDrawing(false);

    const { moduleCount, roofId } = calculateModulePositions(polygon, map, setModules);
    
    const newRoofDetails = [...roofDetails, { roofId, moduleCount }];
    setRoofDetails(newRoofDetails);

    const allPaths = [...polygons, polygon].map((poly) =>
      poly.getPath().getArray()
    );
    onRoofOutlineComplete(allPaths, newRoofDetails);

    toast({
      title: "Sehr gut!",
      description: `${moduleCount} Module können auf dieser Dachfläche installiert werden. ${
        polygons.length === 0
          ? "Sie können weitere Dächer hinzufügen oder die Form durch Ziehen der Punkte anpassen."
          : "Sie können weitere Dachflächen einzeichnen oder die Formen anpassen."
      }`,
      duration: 5000,
    });
  };

  return (
    <div className="space-y-4">
      <Instructions />

      <div className="w-full h-[calc(100vh-400px)] md:h-[600px] rounded-lg overflow-hidden relative">
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-lg font-semibold">Analysiere Dach...</p>
              <p className="text-sm text-gray-600">Bitte warten Sie einen Moment</p>
            </div>
          </div>
        )}

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={19}
          center={coordinates}
          onLoad={onLoad}
          options={{
            mapTypeId: "satellite",
            tilt: 0,
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
            gestureHandling: "greedy",
            styles: [
              {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          <DrawingManager
            onPolygonComplete={onPolygonComplete}
            options={{
              drawingControl: false,
              drawingMode: isDrawing
                ? google.maps.drawing.OverlayType.POLYGON
                : null,
              polygonOptions: {
                fillColor: "#2563eb",
                fillOpacity: 0.3,
                strokeColor: "#2563eb",
                strokeWeight: 2,
                editable: true,
                draggable: true,
              },
            }}
          />
        </GoogleMap>

        <MapControls
          isDrawing={isDrawing}
          polygonsExist={polygons.length > 0}
          onStartDrawing={startDrawing}
          onDeleteLastRoof={deleteLastRoof}
        />
      </div>
    </div>
  );
};