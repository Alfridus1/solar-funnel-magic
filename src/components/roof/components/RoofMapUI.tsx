import { useState } from "react";
import { GoogleMap, DrawingManager, Marker } from "@react-google-maps/api";
import { MapControls } from "./MapControls";
import { Loader2 } from "lucide-react";
import { libraries } from "@/hooks/useGoogleMaps";

interface RoofMapUIProps {
  coordinates: { lat: number; lng: number };
  isDrawing: boolean;
  isLoading: boolean;
  onLoad: (map: google.maps.Map) => void;
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
  onStartDrawing: () => void;
  onDeleteLastRoof: () => void;
  polygonsExist: boolean;
  onStartRectangle: () => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  position: "relative" as const,
};

const defaultMapOptions = {
  mapTypeId: "satellite",
  tilt: 0,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: true,
};

export const RoofMapUI = ({
  coordinates,
  isDrawing,
  isLoading,
  onLoad,
  onPolygonComplete,
  onStartDrawing,
  onDeleteLastRoof,
  polygonsExist,
  onStartRectangle,
}: RoofMapUIProps) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(coordinates);

  const handleMapLoad = (map: google.maps.Map) => {
    if (!mapInstance) {
      setMapInstance(map);
      onLoad(map);
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setMarkerPosition(newPosition);
      if (mapInstance) {
        mapInstance.panTo(newPosition);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Lade Karte...</p>
        </div>
      </div>
    );
  }

  const mapOptions = {
    ...defaultMapOptions,
    zoomControlOptions: {
      position: window.google?.maps?.ControlPosition?.RIGHT_TOP,
    },
  };

  const drawingManagerOptions = {
    drawingMode: isDrawing ? window.google?.maps?.drawing?.OverlayType?.POLYGON : null,
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
    <div className="space-y-4">
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={19}
          center={markerPosition}
          onLoad={handleMapLoad}
          options={mapOptions}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE,
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
          onStartRectangle={onStartRectangle}
        />
      </div>
    </div>
  );
};