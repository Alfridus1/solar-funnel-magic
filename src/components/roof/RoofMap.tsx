import { useState, useCallback } from "react";
import { GoogleMap, DrawingManager } from "@react-google-maps/api";
import { useToast } from "@/components/ui/use-toast";
import { Instructions } from "./components/Instructions";
import { MapControls } from "./components/MapControls";
import { calculateModulePositions } from "./utils/moduleCalculations";

interface RoofMapProps {
  coordinates: { lat: number; lng: number };
  onRoofOutlineComplete: (paths: google.maps.LatLng[][]) => void;
}

export const RoofMap = ({ coordinates, onRoofOutlineComplete }: RoofMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [modules, setModules] = useState<google.maps.Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const clearModules = () => {
    modules.forEach((module) => module.setMap(null));
    setModules([]);
  };

  const startDrawing = () => {
    setIsDrawing(true);
    clearModules();
    toast({
      title: "Zeichenmodus aktiviert",
      description:
        "Klicken Sie nacheinander auf die Ecken Ihres Daches. Klicken Sie zum Abschluss auf den ersten Punkt zurück.",
      duration: 5000,
    });
  };

  const deleteLastRoof = () => {
    if (polygons.length > 0) {
      const lastPolygon = polygons[polygons.length - 1];
      lastPolygon.setMap(null);
      setPolygons((prev) => prev.slice(0, -1));
      clearModules();

      const allPaths = polygons.slice(0, -1).map((poly) => poly.getPath().getArray());
      onRoofOutlineComplete(allPaths);

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

    const moduleCount = calculateModulePositions(polygon, map, setModules);

    const allPaths = [...polygons, polygon].map((poly) =>
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
      <Instructions />

      <div className="w-full h-[calc(100vh-400px)] md:h-[600px] rounded-lg overflow-hidden relative">
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