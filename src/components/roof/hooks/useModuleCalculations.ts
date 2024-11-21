import { useState, useEffect } from 'react';
import { MODULE_WIDTH, MODULE_HEIGHT, FRAME_MARGIN } from '../utils/constants';

interface ModuleCalculationResult {
  moduleCount: number;
  totalPower: number;
  roofArea: number;
  efficiency: number;
}

export const useModuleCalculations = (polygon: google.maps.Polygon | null) => {
  const [calculations, setCalculations] = useState<ModuleCalculationResult>({
    moduleCount: 0,
    totalPower: 0,
    roofArea: 0,
    efficiency: 0,
  });

  useEffect(() => {
    if (!polygon) {
      setCalculations({
        moduleCount: 0,
        totalPower: 0,
        roofArea: 0,
        efficiency: 0,
      });
      return;
    }

    // Berechne die Dachfläche
    const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
    const roofAreaInSquareMeters = area;

    // Berechne die verfügbare Fläche unter Berücksichtigung von Abständen
    const moduleArea = MODULE_WIDTH * MODULE_HEIGHT;
    const moduleWithMargin = (MODULE_WIDTH + FRAME_MARGIN) * (MODULE_HEIGHT + FRAME_MARGIN);
    
    // Berücksichtige Dachneigung und andere Faktoren
    const usableAreaFactor = 0.85; // 85% der Fläche ist nutzbar
    const usableArea = roofAreaInSquareMeters * usableAreaFactor;

    // Berechne die maximale Anzahl der Module
    const theoreticalMaxModules = Math.floor(usableArea / moduleWithMargin);
    
    // Berücksichtige praktische Einschränkungen
    const practicalModuleCount = Math.floor(theoreticalMaxModules * 0.95); // 95% der theoretisch möglichen Module
    
    // Berechne die Gesamtleistung (400Wp pro Modul)
    const totalPower = practicalModuleCount * 400;
    
    // Berechne die Effizienz (Verhältnis von genutzter zu verfügbarer Fläche)
    const efficiency = (practicalModuleCount * moduleArea) / roofAreaInSquareMeters * 100;

    setCalculations({
      moduleCount: practicalModuleCount,
      totalPower: totalPower,
      roofArea: roofAreaInSquareMeters,
      efficiency: Math.round(efficiency * 100) / 100,
    });
  }, [polygon]);

  return calculations;
};