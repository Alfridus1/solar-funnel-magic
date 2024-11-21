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
    modules.forEach(module => module.setMap(null));
    // Leere das Modules-Array
    setModules([]);
  }, [modules, setModules, onLog]);

  const updateModules = useCallback((polygon: google.maps.Polygon, roofId: string) => {
    onLog?.("Aktualisiere Module nach Formänderung");
    // Zuerst alle bestehenden Module löschen
    clearModules();
    
    // Sofortige Berechnung der Module
    const { moduleCount } = calculateModulePositions(polygon, map, setModules);
    
    const updatedRoofDetails = roofDetails.map(detail => 
      detail.roofId === roofId ? { ...detail, moduleCount } : detail
    );
    
    setRoofDetails(updatedRoofDetails);
    const allPaths = polygons.map(poly => poly.getPath().getArray());
    onRoofOutlineComplete(allPaths, updatedRoofDetails);
  }, [map, polygons, roofDetails, setRoofDetails, onRoofOutlineComplete, clearModules, onLog, setModules]);

  const addPolygonListeners = useCallback((polygon: google.maps.Polygon, roofId: string) => {
    // Event-Listener für Vertex-Änderungen (wenn Eckpunkte verschoben werden)
    google.maps.event.addListener(polygon, 'mouseup', () => {
      onLog?.("Polygon-MouseUp-Event ausgelöst");
      updateModules(polygon, roofId);
    });

    // Event-Listener für Pfadänderungen
    const paths = polygon.getPaths();
    paths.forEach((path) => {
      ['insert_at', 'remove_at', 'set_at'].forEach(eventName => {
        path.addListener(eventName, () => {
          onLog?.(`Pfad-${eventName}-Event ausgelöst`);
          updateModules(polygon, roofId);
        });
      });
    });

    // Event-Listener für Polygon-Bewegungen
    google.maps.event.addListener(polygon, 'dragend', () => {
      onLog?.("Polygon-Drag-Event ausgelöst");
      updateModules(polygon, roofId);
    });
  }, [updateModules, onLog]);

  return {
    clearModules,
    updateModules,
    addPolygonListeners
  };
};