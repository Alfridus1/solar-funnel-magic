import { useCallback } from "react";
import { calculateModulePositions } from "../utils/moduleCalculations";

interface UseModuleManagementProps {
  map: google.maps.Map | null;
  polygons: google.maps.Polygon[];
  modules: google.maps.Rectangle[];
  setModules: (modules: google.maps.Rectangle[]) => void;
  roofDetails: { roofId: string; moduleCount: number; kWp: number }[];
  setRoofDetails: React.Dispatch<React.SetStateAction<{ roofId: string; moduleCount: number; kWp: number }[]>>;
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
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
    modules.forEach(module => module?.setMap(null));
    setModules([]);
  }, [modules, setModules, onLog]);

  const recalculateAllModules = useCallback(() => {
    onLog?.("Berechne alle Module neu");
    clearModules();
    
    const newModules: google.maps.Rectangle[] = [];
    const newRoofDetails: { roofId: string; moduleCount: number; kWp: number }[] = [];

    polygons.forEach(polygon => {
      const { moduleCount, roofId, kWp } = calculateModulePositions(polygon, map, (calculatedModules) => {
        newModules.push(...calculatedModules);
      });
      newRoofDetails.push({ roofId, moduleCount, kWp });
    });

    setModules(newModules);
    setRoofDetails(newRoofDetails);
    
    const allPaths = polygons.map(poly => poly.getPath().getArray());
    onRoofOutlineComplete(allPaths, newRoofDetails);
  }, [map, polygons, clearModules, setModules, setRoofDetails, onRoofOutlineComplete, onLog]);

  const addPolygonListeners = useCallback((polygon: google.maps.Polygon, roofId: string) => {
    let dragTimeout: NodeJS.Timeout;

    const handleUpdate = () => {
      if (dragTimeout) {
        clearTimeout(dragTimeout);
      }
      dragTimeout = setTimeout(() => {
        recalculateAllModules();
      }, 100);
    };

    google.maps.event.addListener(polygon, 'mouseup', () => {
      onLog?.("Polygon-MouseUp-Event ausgelöst");
      recalculateAllModules();
    });

    const paths = polygon.getPaths();
    paths.forEach((path) => {
      ['insert_at', 'remove_at', 'set_at'].forEach(eventName => {
        path.addListener(eventName, () => {
          onLog?.(`Pfad-${eventName}-Event ausgelöst`);
          recalculateAllModules();
        });
      });
    });

    google.maps.event.addListener(polygon, 'drag', () => {
      onLog?.("Polygon wird gezogen");
      handleUpdate();
    });

    google.maps.event.addListener(polygon, 'dragend', () => {
      onLog?.("Polygon-Drag-Event beendet");
      if (dragTimeout) {
        clearTimeout(dragTimeout);
      }
      recalculateAllModules();
    });

  }, [recalculateAllModules, onLog]);

  return {
    clearModules,
    updateModules: recalculateAllModules,
    addPolygonListeners
  };
};