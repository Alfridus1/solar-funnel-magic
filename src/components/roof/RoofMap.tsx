import { useState, useCallback } from "react";
import { GoogleMap, DrawingManager, Polygon } from "@react-google-maps/api";
import { Info, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface RoofMapProps {
  coordinates: { lat: number; lng: number };
  onRoofOutlineComplete: (path: google.maps.LatLng[]) => void;
}

export const RoofMap = ({ coordinates, onRoofOutlineComplete }: RoofMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPolygon, setCurrentPolygon] = useState<google.maps.Polygon | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const startDrawing = () => {
    setIsDrawing(true);
    toast({
      title: "Zeichenmodus aktiviert",
      description: "Klicken Sie nacheinander auf die Ecken Ihres Daches. Klicken Sie zum Abschluss auf den ersten Punkt zurück.",
      duration: 5000,
    });
  };

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    if (currentPolygon) {
      currentPolygon.setMap(null);
    }
    setCurrentPolygon(polygon);
    setIsDrawing(false);
    const path = polygon.getPath().getArray();
    onRoofOutlineComplete(path);
    
    toast({
      title: "Sehr gut!",
      description: "Ihre Dachfläche wurde erfolgreich eingezeichnet. Sie können die Form jederzeit durch Ziehen der Punkte anpassen.",
      duration: 5000,
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-full">
            <Pencil className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">So zeichnen Sie Ihr Dach ein:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Klicken Sie auf den "Dach einzeichnen" Button unten</li>
              <li>Klicken Sie nacheinander auf die Ecken Ihres Daches</li>
              <li>Schließen Sie die Form, indem Sie wieder auf den ersten Punkt klicken</li>
              <li>Sie können die Form danach noch durch Ziehen der Punkte anpassen</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-400px)] md:h-[400px] rounded-lg overflow-hidden relative">
        <GoogleMap
          zoom={19}
          center={coordinates}
          mapContainerClassName="w-full h-full"
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
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          <DrawingManager
            onPolygonComplete={onPolygonComplete}
            options={{
              drawingControl: false,
              drawingMode: isDrawing ? google.maps.drawing.OverlayType.POLYGON : null,
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

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button
            size="lg"
            onClick={startDrawing}
            disabled={isDrawing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg text-lg"
          >
            {isDrawing ? (
              "Zeichnen Sie jetzt Ihr Dach ein..."
            ) : (
              <>
                <Pencil className="mr-2 h-5 w-5" />
                Dach einzeichnen
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};