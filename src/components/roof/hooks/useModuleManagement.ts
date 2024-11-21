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
    modules.forEach(module => module.setMap(null));
    setModules([]);
  }, [modules, setModules, onLog]);

  const updateModules = useCallback((polygon: google.maps.Polygon, roofId: string) => {
    onLog?.("Aktualisiere Module nach Formänderung");
    clearModules();
    
    const { moduleCount } = calculateModulePositions(polygon, map, setModules);
    
    const updatedRoofDetails = roofDetails.map(detail => 
      detail.roofId === roofId ? { ...detail, moduleCount } : detail
    );
    
    setRoofDetails(updatedRoofDetails);
    const allPaths = polygons.map(poly => poly.getPath().getArray());
    onRoofOutlineComplete(allPaths, updatedRoofDetails);
  }, [map, polygons, roofDetails, setRoofDetails, onRoofOutlineComplete, clearModules, onLog, setModules]);

  const addPolygonListeners = useCallback((polygon: google.maps.Polygon, roofId: string) => {
    const paths = polygon.getPaths();
    paths.forEach((path) => {
      google.maps.event.addListener(path, 'insert_at', () => updateModules(polygon, roofId));
      google.maps.event.addListener(path, 'remove_at', () => updateModules(polygon, roofId));
      google.maps.event.addListener(path, 'set_at', () => updateModules(polygon, roofId));
    });

    google.maps.event.addListener(polygon, 'bounds_changed', () => updateModules(polygon, roofId));
  }, [updateModules]);

  return {
    clearModules,
    updateModules,
    addPolygonListeners
  };
};