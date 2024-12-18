import { calculateModulePositions } from "../utils/moduleCalculations";

interface UseRoofMapHandlersProps {
  map: google.maps.Map | null;
  polygons: google.maps.Polygon[];
  setPolygons: React.Dispatch<React.SetStateAction<google.maps.Polygon[]>>;
  modules: google.maps.Rectangle[];
  setModules: (modules: google.maps.Rectangle[]) => void;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  roofDetails: { roofId: string; moduleCount: number; kWp: number }[];
  setRoofDetails: (roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
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
  onLog,
}: UseRoofMapHandlersProps) => {
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
      
      if (polygons.length === 1) {
        clearModules();
      }
      
      const updatedRoofDetails = roofDetails.slice(0, -1);
      setRoofDetails(updatedRoofDetails);

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

    const { moduleCount, roofId, kWp } = calculateModulePositions(polygon, map, setModules);
    onLog?.(`Module berechnet: ${moduleCount} (${kWp} kWp)`);
    
    const newRoofDetails = [...roofDetails, { roofId, moduleCount, kWp }];
    setRoofDetails(newRoofDetails);

    const allPaths = [...polygons, polygon].map((poly) =>
      poly.getPath().getArray()
    );
    onRoofOutlineComplete(allPaths, newRoofDetails);

    toast({
      title: "Sehr gut!",
      description: `${moduleCount} Module mit ${kWp} kWp können optimal auf dieser Dachfläche installiert werden. ${
        polygons.length === 0
          ? "Sie können weitere Dächer hinzufügen oder die Form durch Ziehen der Punkte anpassen."
          : "Sie können weitere Dachflächen einzeichnen oder die Formen anpassen."
      }`,
      duration: 5000,
    });
  };

  return {
    startDrawing,
    deleteLastRoof,
    onPolygonComplete
  };
};