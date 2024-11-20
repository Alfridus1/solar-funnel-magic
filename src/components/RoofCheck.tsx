import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { calculateRoofArea, calculateSolarMetrics } from "@/utils/roofCalculations";
import { RoofCheckContent } from "./RoofCheck/RoofCheckContent";

interface RoofCheckProps {
  address: string;
  onLog?: (message: string) => void;
}

interface Metrics {
  monthlyProduction: number;
  annualSavings: number;
  roofArea: number;
  possiblePanels: number;
  kWp: number;
  roofDetails: { roofId: string; moduleCount: number }[];
}

export const RoofCheck = ({ address, onLog }: RoofCheckProps) => {
  const [paths, setPaths] = useState<google.maps.LatLng[][]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    monthlyProduction: 0,
    annualSavings: 0,
    roofArea: 0,
    possiblePanels: 0,
    kWp: 0,
    roofDetails: []
  });

  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "drawing"],
  });

  const handleRoofOutlineComplete = useCallback(
    (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => {
      setPaths(paths);
      const totalArea = calculateRoofArea(paths);
      const calculatedMetrics = calculateSolarMetrics(totalArea);
      setMetrics({
        ...calculatedMetrics,
        roofArea: totalArea,
        roofDetails
      });
    },
    []
  );

  const handleContinue = () => {
    if (paths.length === 0) return;
    navigate("/recommended-config", {
      state: {
        metrics,
        address,
      },
    });
  };

  if (loadError) {
    return (
      <Card className="max-w-5xl mx-auto p-6">
        <div className="text-center text-red-600">
          Fehler beim Laden der Google Maps API. Bitte versuchen Sie es später erneut.
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="max-w-5xl mx-auto p-6">
        <div className="text-center">Laden...</div>
      </Card>
    );
  }

  return (
    <RoofCheckContent
      handleRoofOutlineComplete={handleRoofOutlineComplete}
      paths={paths}
      metrics={metrics}
      handleContinue={handleContinue}
      onLog={onLog}
    />
  );
};