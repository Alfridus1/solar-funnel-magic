import { useState, useCallback, useEffect } from 'react';
import { Square, Move, Trash2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GoogleMap, DrawingManager, useLoadScript } from '@react-google-maps/api';
import { Loader2 } from "lucide-react";
import { calculateModulePositions } from './utils/moduleCalculations';

interface RoofDesignerProps {
  onComplete?: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
  address: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

// Fallback coordinates for Germany
const defaultCenter = {
  lat: 51.1657,
  lng: 10.4515,
};

const libraries: ("places" | "drawing" | "geometry")[] = ["places", "drawing", "geometry"];

export const RoofDesigner = ({ onComplete, address }: RoofDesignerProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [modules, setModules] = useState<google.maps.Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [center, setCenter] = useState(defaultCenter);
  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && address) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          setCenter({
            lat: location.lat(),
            lng: location.lng(),
          });
          if (map) {
            map.setCenter(location);
            map.setZoom(19);
          }
        }
      });
    }
  }, [isLoaded, address, map]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const clearModules = useCallback(() => {
    modules.forEach(module => module.setMap(null));
    setModules([]);
  }, [modules]);

  const onPolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    setPolygons(prev => [...prev, polygon]);
    setIsDrawing(false);
    
    const { moduleCount, roofId } = calculateModulePositions(polygon, map, setModules);

    toast({
      title: "Dachfläche erstellt",
      description: `${moduleCount} Module können auf dieser Dachfläche installiert werden.`,
      duration: 3000,
    });

    if (onComplete) {
      const paths = polygons.map(p => p.getPath().getArray());
      paths.push(polygon.getPath().getArray());
      onComplete(paths, [{ roofId, moduleCount }]);
    }
  }, [polygons, onComplete, map, toast]);

  const deleteLastRoof = useCallback(() => {
    if (polygons.length > 0) {
      const lastPolygon = polygons[polygons.length - 1];
      lastPolygon.setMap(null);
      setPolygons(prev => prev.slice(0, -1));
      clearModules();

      toast({
        title: "Dachfläche entfernt",
        description: "Die letzte Dachfläche wurde entfernt.",
        duration: 3000,
      });

      if (onComplete) {
        const paths = polygons.slice(0, -1).map(p => p.getPath().getArray());
        onComplete(paths, []);
      }
    }
  }, [polygons, onComplete, clearModules, toast]);

  const startDrawing = () => {
    setIsDrawing(true);
    toast({
      title: "Zeichenmodus aktiviert",
      description: "Klicken Sie nacheinander auf die Ecken Ihres Daches. Klicken Sie zum Abschluss auf den ersten Punkt zurück.",
      duration: 5000,
    });
  };

  if (loadError) {
    return (
      <div className="p-4 text-red-600">
        Fehler beim Laden der Google Maps API. Bitte versuchen Sie es später erneut.
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

  const drawingManagerOptions = {
    drawingControl: false,
    drawingMode: isDrawing ? google.maps.drawing.OverlayType.POLYGON : null,
    polygonOptions: {
      fillColor: '#2563eb',
      fillOpacity: 0.3,
      strokeColor: '#2563eb',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      editable: true,
      clickable: true,
      draggable: true,
      zIndex: 1,
    },
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={19}
          center={center}
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
            options={drawingManagerOptions}
          />
          
          <div className="absolute top-4 left-4 z-10">
            <Button
              size="sm"
              onClick={startDrawing}
              disabled={isDrawing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg"
            >
              <Plus className="mr-1 h-4 w-4" />
              Dach einzeichnen
            </Button>
          </div>
        </GoogleMap>
      </div>

      {polygons.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={deleteLastRoof}
            disabled={polygons.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Letztes Dach entfernen
          </Button>
        </div>
      )}

      {polygons.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Move className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              Sie können die Dachform durch Ziehen der Punkte anpassen
            </span>
          </div>
        </div>
      )}
    </div>
  );
};