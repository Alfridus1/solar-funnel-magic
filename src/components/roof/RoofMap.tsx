import { GoogleMap, Marker, DrawingManager } from "@react-google-maps/api";
import { useState, useCallback } from "react";

interface RoofMapProps {
  coordinates: { lat: number; lng: number };
  onRoofOutlineComplete: (path: google.maps.LatLng[]) => void;
}

export const RoofMap = ({ coordinates, onRoofOutlineComplete }: RoofMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath().getArray();
    onRoofOutlineComplete(path);
    polygon.setMap(null);
  };

  return (
    <div className="w-full h-[300px] mb-6 rounded-lg overflow-hidden">
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
        }}
      >
        <Marker position={coordinates} />
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