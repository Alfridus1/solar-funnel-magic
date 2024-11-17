import { useState, useCallback } from "react";
import { GoogleMap, Marker, DrawingManager, Polygon } from "@react-google-maps/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RoofMapProps {
  coordinates: { lat: number; lng: number };
  onRoofOutlineComplete: (path: google.maps.LatLng[]) => void;
}

export const RoofMap = ({ coordinates, onRoofOutlineComplete }: RoofMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPolygon, setCurrentPolygon] = useState<google.maps.Polygon | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [targetMarker, setTargetMarker] = useState<google.maps.Marker | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // Create a pulsing marker at the center
    const marker = new google.maps.Marker({
      position: coordinates,
      map: map,
      animation: google.maps.Animation.BOUNCE,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#FF0000",
        fillOpacity: 0.8,
        strokeWeight: 2,
        strokeColor: "#FF0000"
      }
    });
    setTargetMarker(marker);
  }, [coordinates]);

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    if (currentPolygon) {
      currentPolygon.setMap(null);
    }
    setCurrentPolygon(polygon);
    const path = polygon.getPath().getArray();
    onRoofOutlineComplete(path);
  };

  const analyzeRoofWithAI = async () => {
    if (!map) return;

    try {
      setIsAnalyzing(true);
      toast.info("Analysiere Dach mit KI...");

      const center = map.getCenter();
      const zoom = map.getZoom();
      const div = map.getDiv();
      const width = Math.min(div.clientWidth * 2, 1024);
      const height = Math.min(div.clientHeight * 2, 1024);

      const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?`
        + `center=${center?.lat()},${center?.lng()}`
        + `&zoom=${zoom}`
        + `&size=${width}x${height}`
        + `&scale=2`
        + `&maptype=satellite`
        + `&markers=color:red|${center?.lat()},${center?.lng()}`
        + `&style=feature:all|element:labels|visibility:off`
        + `&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

      const { data, error } = await supabase.functions.invoke('analyze-roof', {
        body: { 
          imageUrl: staticMapUrl,
          location: {
            lat: center?.lat(),
            lng: center?.lng(),
            zoom: zoom
          }
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const coordinates = JSON.parse(data.coordinates);
      
      if (currentPolygon) {
        currentPolygon.setMap(null);
      }

      const polygonPath = coordinates.map((coord: [number, number]) => ({
        lat: coord[0],
        lng: coord[1]
      }));

      const newPolygon = new google.maps.Polygon({
        paths: polygonPath,
        strokeColor: "#2563eb",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#2563eb",
        fillOpacity: 0.35,
        editable: true,
        map: map
      });

      setCurrentPolygon(newPolygon);
      onRoofOutlineComplete(newPolygon.getPath().getArray());
      toast.success("Dachanalyse abgeschlossen!");
    } catch (error) {
      console.error('Error analyzing roof:', error);
      toast.error("Fehler bei der Dachanalyse. Bitte versuchen Sie es erneut.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full h-[400px] mb-6 rounded-lg overflow-hidden relative">
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
      <button
        onClick={analyzeRoofWithAI}
        disabled={isAnalyzing}
        className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? "Analysiere..." : "KI-Analyse starten"}
      </button>
    </div>
  );
};