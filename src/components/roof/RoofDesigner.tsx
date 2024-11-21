import React, { useState, useCallback } from 'react';
import { Square, Move, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GoogleMap, DrawingManager, useLoadScript } from '@react-google-maps/api';
import { Loader2 } from "lucide-react";

interface RoofDesignerProps {
  onComplete?: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 52.520008,
  lng: 13.404954,
};

const libraries: ("places" | "drawing" | "geometry")[] = ["places", "drawing", "geometry"];

export const RoofDesigner = ({ onComplete }: RoofDesignerProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onPolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    setPolygons(prev => [...prev, polygon]);
    
    // Berechne die Anzahl der möglichen Module basierend auf der Fläche
    const path = polygon.getPath();
    const area = google.maps.geometry.spherical.computeArea(path);
    const moduleCount = Math.floor(area / (1.7 * 1)); // Ungefähre Modulgröße in m²

    const roofId = `roof-${Date.now()}`;
    const roofDetails = [{ roofId, moduleCount }];

    toast({
      title: "Dachfläche erstellt",
      description: `${moduleCount} Module können auf dieser Dachfläche installiert werden.`,
      duration: 3000,
    });

    if (onComplete) {
      const paths = polygons.map(p => p.getPath().getArray());
      paths.push(path.getArray());
      onComplete(paths, roofDetails);
    }
  }, [polygons, onComplete, toast]);

  const deleteLastRoof = useCallback(() => {
    if (polygons.length > 0) {
      const lastPolygon = polygons[polygons.length - 1];
      lastPolygon.setMap(null);
      setPolygons(prev => prev.slice(0, -1));

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
  }, [polygons, onComplete, toast]);

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
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYGON],
    },
    polygonOptions: {
      fillColor: '#2563eb',
      fillOpacity: 0.3,
      strokeColor: '#2563eb',
      strokeWeight: 2,
      clickable: true,
      editable: true,
      draggable: true,
      zIndex: 1,
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant="destructive"
          onClick={deleteLastRoof}
          disabled={polygons.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Letztes Dach entfernen
        </Button>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={19}
          center={defaultCenter}
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
        </GoogleMap>
      </div>

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