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

const MODULE_WIDTH = 1.135; // meters
const MODULE_HEIGHT = 1.962; // meters
const METERS_PER_DEGREE = 111319.9; // approximate meters per degree at equator

export const RoofMap = ({ coordinates, onRoofOutlineComplete }: RoofMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [modules, setModules] = useState<google.maps.Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const clearModules = () => {
    modules.forEach(module => module.setMap(null));
    setModules([]);
  };

  const calculateModulePositions = (polygon: google.maps.Polygon) => {
    clearModules();
    const bounds = new google.maps.LatLngBounds();
    const path = polygon.getPath();
    path.forEach(point => bounds.extend(point));

    const center = bounds.getCenter();
    const latMetersPerDegree = METERS_PER_DEGREE;
    const lngMetersPerDegree = METERS_PER_DEGREE * Math.cos(center.lat() * Math.PI / 180);

    const moduleWidthDeg = MODULE_WIDTH / lngMetersPerDegree;
    const moduleHeightDeg = MODULE_HEIGHT / latMetersPerDegree;

    const newModules: google.maps.Rectangle[] = [];
    const polygonBounds = polygon.getBounds();
    if (!polygonBounds) return;

    const north = polygonBounds.getNorthEast().lat();
    const south = polygonBounds.getSouthWest().lat();
    const east = polygonBounds.getNorthEast().lng();
    const west = polygonBounds.getSouthWest().lng();

    for (let lat = south; lat < north; lat += moduleHeightDeg) {
      for (let lng = west; lng < east; lng += moduleWidthDeg) {
        const moduleBounds = {
          north: lat + moduleHeightDeg,
          south: lat,
          east: lng + moduleWidthDeg,
          west: lng
        };

        const moduleCenter = new google.maps.LatLng(
          lat + moduleHeightDeg / 2,
          lng + moduleWidthDeg / 2
        );

        if (google.maps.geometry.poly.containsLocation(moduleCenter, polygon)) {
          const moduleRect = new google.maps.Rectangle({
            bounds: moduleBounds,
            map: map,
            fillColor: "#2563eb",
            fillOpacity: 0.4,
            strokeColor: "#1e40af",
            strokeWeight: 1
          });
          newModules.push(moduleRect);
        }
      }
    }

    setModules(newModules);
    return newModules.length;
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
      setPolygons(prev => prev.slice(0, -1));
      clearModules();
      
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
    
    const moduleCount = calculateModulePositions(polygon);
    
    // Get paths from all polygons including the new one
    const allPaths = [...polygons, polygon].map(poly => 
      poly.getPath().getArray()
    );
    onRoofOutlineComplete(allPaths);
    
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
              <li>Die möglichen PV-Module werden automatisch eingezeichnet</li>
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