import { useCallback } from "react";
import { calculateModulePositions } from "../utils/moduleCalculations";

interface UseRectangleCreationProps {
  map: google.maps.Map | null;
  polygons: google.maps.Polygon[];
  setPolygons: React.Dispatch<React.SetStateAction<google.maps.Polygon[]>>;
  setModules: (modules: google.maps.Rectangle[]) => void;
  roofDetails: { roofId: string; moduleCount: number; kWp: number }[];
  setRoofDetails: React.Dispatch<React.SetStateAction<{ roofId: string; moduleCount: number; kWp: number }[]>>;
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
  addPolygonListeners: (polygon: google.maps.Polygon, roofId: string) => void;
}

export const useRectangleCreation = ({
  map,
  polygons,
  setPolygons,
  setModules,
  roofDetails,
  setRoofDetails,
  onRoofOutlineComplete,
  addPolygonListeners
}: UseRectangleCreationProps) => {
  const createRectangle = useCallback(() => {
    if (!map) return;
    
    const center = map.getCenter();
    if (!center) return;
    
    const lat = center.lat();
    const lng = center.lng();
    
    const rectanglePoints = [
      { lat: lat + 0.0002, lng: lng - 0.0003 },
      { lat: lat + 0.0002, lng: lng + 0.0003 },
      { lat: lat - 0.0002, lng: lng + 0.0003 },
      { lat: lat - 0.0002, lng: lng - 0.0003 }
    ];
    
    const polygon = new google.maps.Polygon({
      paths: rectanglePoints,
      fillColor: "#2563eb",
      fillOpacity: 0.3,
      strokeColor: "#2563eb",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      editable: true,
      clickable: true,
      draggable: true,
      map: map
    });

    const { moduleCount, roofId, kWp } = calculateModulePositions(polygon, map, setModules);
    addPolygonListeners(polygon, roofId);
    
    const newRoofDetails = [...roofDetails, { roofId, moduleCount, kWp }];
    setRoofDetails(newRoofDetails);
    
    setPolygons(prevPolygons => [...prevPolygons, polygon]);
    const allPaths = [...polygons, polygon].map(poly => poly.getPath().getArray());
    onRoofOutlineComplete(allPaths, newRoofDetails);
  }, [map, polygons, roofDetails, setPolygons, setRoofDetails, onRoofOutlineComplete, addPolygonListeners, setModules]);

  return { createRectangle };
};