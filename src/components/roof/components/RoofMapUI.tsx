import { useState, useCallback } from "react";
import { GoogleMap, DrawingManager, Marker } from "@react-google-maps/api";
import { MapControls } from "./MapControls";

interface RoofMapUIProps {
  coordinates: { lat: number; lng: number };
  isDrawing: boolean;
  onLoad: (map: google.maps.Map) => void;
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
  onStartDrawing: () => void;
  onDeleteLastRoof: () => void;
  polygonsExist: boolean;
}

export const RoofMapUI = ({
  coordinates,
  isDrawing,
  onLoad,
  onPolygonComplete,
  onStartDrawing,
  onDeleteLastRoof,
  polygonsExist,
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
        
        <DrawingManager
          onPolygonComplete={onPolygonComplete}
          options={drawingManagerOptions}
        />
      </GoogleMap>
      
      <MapControls
        isDrawing={isDrawing}
        polygonsExist={polygonsExist}
        onStartDrawing={onStartDrawing}
        onDeleteLastRoof={onDeleteLastRoof}
      />
    </div>
  );
};