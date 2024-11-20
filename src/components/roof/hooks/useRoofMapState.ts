import { useState } from "react";

export const useRoofMapState = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [modules, setModules] = useState<google.maps.Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roofDetails, setRoofDetails] = useState<{ roofId: string; moduleCount: number }[]>([]);

  return {
    map,
    setMap,
    polygons,
    setPolygons,
    modules,
    setModules,
    isDrawing,
    setIsDrawing,
    isAnalyzing,
    setIsAnalyzing,
    roofDetails,
    setRoofDetails
  };
};