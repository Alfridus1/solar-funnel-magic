import { GoogleMap, DrawingManager, Marker } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";

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
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  return (
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
        <Marker
          position={coordinates}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#ef4444",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }}
        />
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
    </div>
  );
};