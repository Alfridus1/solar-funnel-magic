import { useCallback } from "react";
import { calculateModulePositions } from "../utils/moduleCalculations";

interface UseModuleManagementProps {
  map: google.maps.Map | null;
  polygons: google.maps.Polygon[];
  modules: google.maps.Rectangle[];
  setModules: (modules: google.maps.Rectangle[]) => void;
  roofDetails: { roofId: string; moduleCount: number }[];
  setRoofDetails: (details: { roofId: string; moduleCount: number }[]) => void;
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
  onLog?: (message: string) => void;
}

export const useModuleManagement = ({
  map,
  polygons,
  modules,
  setModules,
  roofDetails,
  setRoofDetails,
  onRoofOutlineComplete,
  onLog
}: UseModuleManagementProps) => {
  const clearModules = useCallback(() => {
    onLog?.("Lösche bestehende Module");
    // Entferne alle Module von der Karte
    modules.forEach(module => {
      if (module) {
        module.setMap(null);
      }
    });
    // Leere das Modules-Array
    setModules([]);
  }, [modules, setModules, onLog]);

  const recalculateAllModules = useCallback(() => {
    onLog?.("Berechne alle Module neu");
    clearModules();
    
    const newModules: google.maps.Rectangle[] = [];
    const newRoofDetails: { roofId: string; moduleCount: number }[] = [];

    polygons.forEach(polygon => {
      const { moduleCount, roofId } = calculateModulePositions(polygon, map, (calculatedModules) => {
        newModules.push(...calculatedModules);
      });
      newRoofDetails.push({ roofId, moduleCount });
    });

    setModules(newModules);
    setRoofDetails(newRoofDetails);
    
    const allPaths = polygons.map(poly => poly.getPath().getArray());
    onRoofOutlineComplete(allPaths, newRoofDetails);
  }, [map, polygons, clearModules, setModules, setRoofDetails, onRoofOutlineComplete, onLog]);

  const updateModules = useCallback((polygon: google.maps.Polygon, roofId: string) => {
    onLog?.("Aktualisiere Module nach Formänderung");
    recalculateAllModules();
  }, [recalculateAllModules, onLog]);

  const addPolygonListeners = useCallback((polygon: google.maps.Polygon, roofId: string) => {
    // Event-Listener für Vertex-Änderungen (wenn Eckpunkte verschoben werden)
    google.maps.event.addListener(polygon, 'mouseup', () => {
      onLog?.("Polygon-MouseUp-Event ausgelöst");
      recalculateAllModules();
    });

    // Event-Listener für Pfadänderungen
    const paths = polygon.getPaths();
    paths.forEach((path) => {
      ['insert_at', 'remove_at', 'set_at'].forEach(eventName => {
        path.addListener(eventName, () => {
          onLog?.(`Pfad-${eventName}-Event ausgelöst`);
          recalculateAllModules();
        });
      });
    });

    // Event-Listener für Polygon-Bewegungen
    google.maps.event.addListener(polygon, 'dragend', () => {
      onLog?.("Polygon-Drag-Event ausgelöst");
      recalculateAllModules();
    });
  }, [recalculateAllModules, onLog]);

  return {
    clearModules,
    updateModules,
    addPolygonListeners
  };
};