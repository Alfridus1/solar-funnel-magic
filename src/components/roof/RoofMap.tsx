import { useState, useCallback } from "react";
import { GoogleMap, DrawingManager, Polygon } from "@react-google-maps/api";
import { Info, Pencil, Plus, Trash2 } from "lucide-react";
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
  onRoofOutlineComplete: (paths: google.maps.LatLng[][]) => void;
}

export const RoofMap = ({ coordinates, onRoofOutlineComplete }: RoofMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
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

  const deleteLastRoof = () => {
    if (polygons.length > 0) {
      const lastPolygon = polygons[polygons.length - 1];
      lastPolygon.setMap(null);
      setPolygons(prev => prev.slice(0, -1));
      
      // Recalculate total area
      const allPaths = polygons.slice(0, -1).map(poly => 
        poly.getPath().getArray()
      );
      onRoofOutlineComplete(allPaths);
      
      toast({
        title: "Dach entfernt",
        description: "Das zuletzt gezeichnete Dach wurde entfernt.",
        duration: 3000,
      });
    }
  };

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    setPolygons(prev => [...prev, polygon]);
    setIsDrawing(false);
    
    // Get paths from all polygons including the new one
    const allPaths = [...polygons, polygon].map(poly => 
      poly.getPath().getArray()
    );
    onRoofOutlineComplete(allPaths);
    
    toast({
      title: "Sehr gut!",
      description: polygons.length === 0 
        ? "Ihre erste Dachfläche wurde erfolgreich eingezeichnet. Sie können weitere Dächer hinzufügen oder die Form durch Ziehen der Punkte anpassen."
        : "Eine weitere Dachfläche wurde hinzugefügt. Sie können weitere Dächer einzeichnen oder die Formen anpassen.",
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
              <li>Klicken Sie auf "Dach hinzufügen" unten</li>
              <li>Klicken Sie nacheinander auf die Ecken Ihres Daches</li>
              <li>Schließen Sie die Form, indem Sie wieder auf den ersten Punkt klicken</li>
              <li>Wiederholen Sie den Vorgang für weitere Dächer</li>
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

        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-center gap-3">
          <Button
            size="sm"
            onClick={startDrawing}
            disabled={isDrawing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg whitespace-nowrap min-w-[160px]"
          >
            <Plus className="mr-1 h-4 w-4" />
            Dach hinzufügen
          </Button>
          
          {polygons.length > 0 && (
            <Button
              size="sm"
              variant="destructive"
              onClick={deleteLastRoof}
              className="rounded-full shadow-lg whitespace-nowrap min-w-[160px]"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Letztes Dach entfernen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};