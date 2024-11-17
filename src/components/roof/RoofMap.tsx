import { useState, useCallback } from "react";
import { GoogleMap, DrawingManager, Polygon } from "@react-google-maps/api";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoofMapProps {
  coordinates: { lat: number; lng: number };
  onRoofOutlineComplete: (path: google.maps.LatLng[]) => void;
}

export const RoofMap = ({ coordinates, onRoofOutlineComplete }: RoofMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPolygon, setCurrentPolygon] = useState<google.maps.Polygon | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    if (currentPolygon) {
      currentPolygon.setMap(null);
    }
    setCurrentPolygon(polygon);
    const path = polygon.getPath().getArray();
    onRoofOutlineComplete(path);
  };

  return (
    <div className="w-full h-[calc(100vh-300px)] md:h-[400px] mb-6 rounded-lg overflow-hidden relative">
      <div className="absolute top-2 left-2 z-10 bg-white/90 p-3 rounded-lg shadow-lg max-w-[280px] md:max-w-none">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Zeichnen Sie Ihr Dach ein</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">
                  Nutzen Sie das Polygon-Werkzeug um die Umrisse Ihres Daches einzuzeichnen. 
                  Klicken Sie auf die Ecken und schließen Sie die Form.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <GoogleMap
        zoom={19}
        center={coordinates}
        mapContainerClassName="w-full h-full"
        onLoad={onLoad}
        options={{
          mapTypeId: "satellite",
          tilt: 0,
          disableDefaultUI: false,
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
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [google.maps.drawing.OverlayType.POLYGON],
            },
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
    </div>
  );
};