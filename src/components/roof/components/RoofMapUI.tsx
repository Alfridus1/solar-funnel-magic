import { useState, useCallback } from "react";
import { GoogleMap, DrawingManager, Marker } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { RoofGrid } from "./RoofGrid";

interface RoofMapUIProps {
  isAnalyzing: boolean;
  coordinates: { lat: number; lng: number };
  onLoad: (map: google.maps.Map) => void;
  isDrawing: boolean;
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
}

export const RoofMapUI = ({
  isAnalyzing,
  coordinates,
  onLoad,
  isDrawing,
  onPolygonComplete
}: RoofMapUIProps) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    position: "relative" as const,
  };

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    if (!mapInstance) {
      setMapInstance(map);
      onLoad(map);
    }
  }, [mapInstance, onLoad]);

  const mapOptions = {
    mapTypeId: "satellite",
    tilt: 0,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
    },
  };

  const drawingManagerOptions = {
    drawingMode: isDrawing ? google.maps.drawing.OverlayType.POLYGON : null,
    drawingControl: false,
    polygonOptions: {
      fillColor: "#2563eb",
      fillOpacity: 0.3,
      strokeColor: "#2563eb",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      editable: true,
      clickable: true,
    },
  };

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-200">
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
            <Loader2 className="animate-spin" />
            <span>Analysiere Dach...</span>
          </div>
        </div>
      )}
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={19}
        center={coordinates}
        onLoad={handleMapLoad}
        options={mapOptions}
      >
        <Marker
          position={coordinates}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#2563eb",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }}
        />
        {mapInstance && <RoofGrid map={mapInstance} coordinates={coordinates} />}
        <DrawingManager
          onPolygonComplete={onPolygonComplete}
          options={drawingManagerOptions}
        />
      </GoogleMap>
    </div>
  );
};