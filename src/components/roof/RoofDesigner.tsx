import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GoogleMap, DrawingManager, useLoadScript } from '@react-google-maps/api';
import { Loader2, Plus, Trash2 } from "lucide-react";

interface RoofDesignerProps {
  onComplete?: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
  address: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const libraries: ("places" | "drawing" | "geometry")[] = ["places", "drawing", "geometry"];

export const RoofDesigner = ({ onComplete, address }: RoofDesignerProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activePolygon, setActivePolygon] = useState<google.maps.Polygon | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(21);
        
        new google.maps.Marker({
          position: location,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#f75c03",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }
        });
      }
    });
  }, [address]);

  const onPolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    setActivePolygon(polygon);
    setIsDrawing(false);

    google.maps.event.addListener(polygon, 'mouseup', () => {
      setActivePolygon(polygon);
    });

    google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
      setActivePolygon(polygon);
    });

    google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
      setActivePolygon(polygon);
    });

    toast({
      title: "Dachfläche erstellt",
      description: "Die Dachfläche wurde erfolgreich eingezeichnet.",
      duration: 3000,
    });
  }, [toast]);

  const startDrawing = () => {
    setIsDrawing(true);
    if (activePolygon) {
      activePolygon.setMap(null);
      setActivePolygon(null);
    }
    toast({
      title: "Zeichenmodus aktiviert",
      description: "Klicken Sie nacheinander auf die Ecken Ihres Daches. Klicken Sie zum Abschluss auf den ersten Punkt zurück.",
      duration: 5000,
    });
  };

  const deletePolygon = () => {
    if (activePolygon) {
      activePolygon.setMap(null);
      setActivePolygon(null);
      toast({
        title: "Dachfläche entfernt",
        description: "Die Dachfläche wurde entfernt.",
        duration: 3000,
      });
    }
  };

  if (loadError) {
    return (
      <div className="p-4 text-red-600">
        Fehler beim Laden der Google Maps API
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Lade Karte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={21}
          onLoad={onLoad}
          options={{
            mapTypeId: 'satellite',
            tilt: 0,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: true,
          }}
        >
          <DrawingManager
            onPolygonComplete={onPolygonComplete}
            options={{
              drawingControl: false,
              drawingMode: isDrawing ? google.maps.drawing.OverlayType.POLYGON : null,
              polygonOptions: {
                fillColor: '#2563eb',
                fillOpacity: 0.3,
                strokeColor: '#2563eb',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                editable: true,
                draggable: true,
                zIndex: 1,
              },
            }}
          />
          
          <div className="absolute top-4 left-4 z-10 space-x-2">
            <Button
              size="sm"
              onClick={startDrawing}
              disabled={isDrawing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg"
            >
              <Plus className="mr-1 h-4 w-4" />
              Dach einzeichnen
            </Button>
            
            {activePolygon && (
              <Button
                size="sm"
                variant="destructive"
                onClick={deletePolygon}
                className="rounded-full shadow-lg"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Löschen
              </Button>
            )}
          </div>
        </GoogleMap>
      </div>
    </div>
  );
};