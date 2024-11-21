import { useState, useCallback } from "react";
import { GoogleMap, DrawingManager, Marker } from "@react-google-maps/api";
import { MapControls } from "./MapControls";
import { Loader2, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface RoofMapUIProps {
  coordinates: { lat: number; lng: number };
  isDrawing: boolean;
  isLoading: boolean;
  onLoad: (map: google.maps.Map) => void;
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
  onStartDrawing: () => void;
  onDeleteLastRoof: () => void;
  polygonsExist: boolean;
  onRotationChange?: (rotation: number) => void;
  currentRotation: number;
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
  onRotationChange = () => {},
  currentRotation,
}: RoofMapUIProps) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(coordinates);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    if (!mapInstance) {
      setMapInstance(map);
      onLoad(map);
    }
  }, [mapInstance, onLoad]);

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

  const handleRotationChange = (value: number[]) => {
    onRotationChange(value[0]);
  };

  const adjustRotation = (amount: number) => {
    const newRotation = (currentRotation + amount + 360) % 360;
    onRotationChange(newRotation);
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
        />

        {polygonsExist && (
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustRotation(-45)}
                className="h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Slider
                value={[currentRotation]}
                onValueChange={handleRotationChange}
                max={360}
                step={1}
                className="w-32"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustRotation(45)}
                className="h-8 w-8"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-1">
              {currentRotation}°
            </p>
          </div>
        )}
      </div>
    </div>
  );
};