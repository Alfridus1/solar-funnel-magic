import { calculateModulePositions } from "../utils/moduleCalculations";

interface UseRoofMapHandlersProps {
  map: google.maps.Map | null;
  polygons: google.maps.Polygon[];
  setPolygons: React.Dispatch<React.SetStateAction<google.maps.Polygon[]>>;
  modules: google.maps.Rectangle[];
  setModules: (modules: google.maps.Rectangle[]) => void;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  roofDetails: { roofId: string; moduleCount: number }[];
  setRoofDetails: (roofDetails: { roofId: string; moduleCount: number }[]) => void;
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  toast: any;
  onLog?: (message: string) => void;
}

export const useRoofMapHandlers = ({
  map,
  polygons,
  setPolygons,
  modules,
  setModules,
  isDrawing,
  setIsDrawing,
  roofDetails,
  setRoofDetails,
  onRoofOutlineComplete,
  setIsAnalyzing,
  toast,
  onLog
}: UseRoofMapHandlersProps) => {
  const handleAutoDetect = async (mapInstance: google.maps.Map) => {
    setIsAnalyzing(true);
    onLog?.("Starte automatische Dacherkennung");
    try {
      const bounds = mapInstance.getBounds();
      const zoom = mapInstance.getZoom();
      if (!bounds) return;

      const center = mapInstance.getCenter();
      if (!center) return;

      onLog?.(`Kartenposition: ${center.lat()}, ${center.lng()}, Zoom: ${zoom}`);

      const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat()},${center.lng()}&zoom=${zoom}&size=640x640&maptype=satellite&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

      onLog?.("Sende Anfrage an analyze-roof Funktion");
      const response = await fetch('/functions/v1/analyze-roof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          location: {
            lat: center.lat(),
            lng: center.lng(),
            zoom: zoom
          }
        }),
      });

      const data = await response.json();
      onLog?.(`Antwort von analyze-roof: ${JSON.stringify(data)}`);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.coordinates && data.coordinates.length > 0) {
        onLog?.("Erstelle Polygon aus erkannten Koordinaten");
        const path = data.coordinates.map((coord: number[]) => ({
          lat: coord[0],
          lng: coord[1]
        }));

        const polygon = new google.maps.Polygon({
          paths: path,
          strokeColor: "#2563eb",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#2563eb",
          fillOpacity: 0.35,
          editable: true,
          map: mapInstance
        });

        setPolygons(prevPolygons => [...prevPolygons, polygon]);
        const { moduleCount, roofId } = calculateModulePositions(polygon, mapInstance, setModules);
        
        const newRoofDetails = [...roofDetails, { roofId, moduleCount }];
        setRoofDetails(newRoofDetails);

        const allPaths = [...polygons, polygon].map(poly =>
          poly.getPath().getArray()
        );
        onRoofOutlineComplete(allPaths, newRoofDetails);

        toast({
          title: "Dach erfolgreich erkannt",
          description: "Die Dachfläche wurde automatisch erkannt. Sie können die Form bei Bedarf anpassen.",
          duration: 5000,
        });
        onLog?.("Automatische Erkennung erfolgreich abgeschlossen");
      }
    } catch (error) {
      console.error('Error during roof detection:', error);
      onLog?.(`Fehler bei der Dacherkennung: ${error.message}`);
      toast({
        title: "Automatische Erkennung fehlgeschlagen",
        description: "Bitte zeichnen Sie die Dachfläche manuell ein.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearModules = () => {
    onLog?.("Lösche bestehende Module");
    modules.forEach((module) => module.setMap(null));
    setModules([]);
  };

  const startDrawing = () => {
    onLog?.("Starte manuelles Zeichnen");
    setIsDrawing(true);
    clearModules();
    toast({
      title: "Zeichenmodus aktiviert",
      description: "Klicken Sie nacheinander auf die Ecken Ihres Daches. Klicken Sie zum Abschluss auf den ersten Punkt zurück.",
      duration: 5000,
    });
  };

  const deleteLastRoof = () => {
    if (polygons.length > 0) {
      onLog?.("Lösche letztes Dach");
      const lastPolygon = polygons[polygons.length - 1];
      lastPolygon.setMap(null);
      setPolygons(prevPolygons => prevPolygons.slice(0, -1));
      
      const updatedRoofDetails = roofDetails.slice(0, -1);
      setRoofDetails(updatedRoofDetails);
      clearModules();

      const allPaths = polygons.slice(0, -1).map((poly) => poly.getPath().getArray());
      onRoofOutlineComplete(allPaths, updatedRoofDetails);

      toast({
        title: "Dach entfernt",
        description: "Das zuletzt gezeichnete Dach wurde entfernt.",
        duration: 3000,
      });
    }
  };

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    onLog?.("Polygon-Zeichnung abgeschlossen");
    setPolygons(prevPolygons => [...prevPolygons, polygon]);
    setIsDrawing(false);

    const { moduleCount, roofId } = calculateModulePositions(polygon, map, setModules);
    onLog?.(`Module berechnet: ${moduleCount}`);
    
    const newRoofDetails = [...roofDetails, { roofId, moduleCount }];
    setRoofDetails(newRoofDetails);

    const allPaths = [...polygons, polygon].map((poly) =>
      poly.getPath().getArray()
    );
    onRoofOutlineComplete(allPaths, newRoofDetails);

    toast({
      title: "Sehr gut!",
      description: `${moduleCount} Module können auf dieser Dachfläche installiert werden. ${
        polygons.length === 0
          ? "Sie können weitere Dächer hinzufügen oder die Form durch Ziehen der Punkte anpassen."
          : "Sie können weitere Dachflächen einzeichnen oder die Formen anpassen."
      }`,
      duration: 5000,
    });
  };

  return {
    handleAutoDetect,
    clearModules,
    startDrawing,
    deleteLastRoof,
    onPolygonComplete
  };
};