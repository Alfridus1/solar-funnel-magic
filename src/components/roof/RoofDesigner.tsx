import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GoogleMap, DrawingManager } from '@react-google-maps/api';
import { Loader2, Plus, Trash2 } from "lucide-react";
import { RoofAreaCalculator } from './components/RoofAreaCalculator';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface RoofDesignerProps {
  address?: string;
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
  onLog?: (message: string) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  position: "relative" as const,
};

export const RoofDesigner = ({ onRoofOutlineComplete, address, onLog }: RoofDesignerProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();
  const { isLoaded, loadError } = useGoogleMaps();

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
    setPolygons(prev => [...prev, polygon]);
    setIsDrawing(false);

    google.maps.event.addListener(polygon, 'mouseup', () => {
      const allPaths = polygons.map(p => p.getPath().getArray());
      allPaths.push(polygon.getPath().getArray());
      
      const roofDetails = allPaths.map((_, index) => ({
        roofId: `roof-${index + 1}`,
        moduleCount: 0,
        kWp: 0
      }));
      
      onRoofOutlineComplete?.(allPaths, roofDetails);
    });

    toast({
      title: "Dachfläche erstellt",
      description: "Die Dachfläche wurde erfolgreich eingezeichnet. Sie können weitere Dachflächen hinzufügen.",
      duration: 3000,
    });
  }, [polygons, onRoofOutlineComplete, toast]);

  const startDrawing = () => {
    setIsDrawing(true);
    toast({
      title: "Zeichenmodus aktiviert",
      description: "Klicken Sie nacheinander auf die Ecken Ihres Daches. Klicken Sie zum Abschluss auf den ersten Punkt zurück.",
      duration: 5000,
    });
  };

  const deleteLastRoof = () => {
    if (polygons.length > 0) {
      const lastPolygon = polygons[polygons.length - 1];
      lastPolygon.setMap(null);
      setPolygons(prev => prev.slice(0, -1));
      
      const remainingPaths = polygons.slice(0, -1).map(p => p.getPath().getArray());
      const roofDetails = remainingPaths.map((_, index) => ({
        roofId: `roof-${index + 1}`,
        moduleCount: 0,
        kWp: 0
      }));
      
      onRoofOutlineComplete?.(remainingPaths, roofDetails);
      
      toast({
        title: "Dachfläche entfernt",
        description: "Die letzte Dachfläche wurde entfernt.",
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
            
            {polygons.length > 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={deleteLastRoof}
                className="rounded-full shadow-lg"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Letztes Dach entfernen
              </Button>
            )}
          </div>
        </GoogleMap>
      </div>

      <RoofAreaCalculator polygons={polygons} />
    </div>
  );
};
