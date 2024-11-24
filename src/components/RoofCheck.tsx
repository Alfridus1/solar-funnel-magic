import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { calculateRoofArea, calculateSolarMetrics } from "@/utils/roofCalculations";
import { RoofCheckContent } from "./RoofCheck/RoofCheckContent";
import { RoofCheckLoading } from "./RoofCheck/RoofCheckLoading";
import { saveConfigToCookie } from "@/utils/configCookieManager";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

interface RoofCheckProps {
  address: string;
  onLog?: (message: string) => void;
}

export const RoofCheck = ({ address, onLog }: RoofCheckProps) => {
  const [paths, setPaths] = useState<google.maps.LatLng[][]>([]);
  const [metrics, setMetrics] = useState({
    monthlyProduction: 0,
    annualSavings: 0,
    roofArea: 0,
    possiblePanels: 0,
    kWp: 0,
    roofDetails: []
  });
  const navigate = useNavigate();

  const { isLoaded, loadError } = useGoogleMaps();

  const handleRoofOutlineComplete = useCallback(
    (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => {
      setPaths(paths);
      const totalArea = calculateRoofArea(paths);
      const calculatedMetrics = calculateSolarMetrics(totalArea);
      const updatedMetrics = {
        ...calculatedMetrics,
        roofArea: Math.round(totalArea * 100) / 100,
        roofDetails
      };
      setMetrics(updatedMetrics);
      onLog?.("Metrics calculated: " + JSON.stringify(updatedMetrics));
    },
    [onLog]
  );

  const handleFinish = useCallback(() => {
    saveConfigToCookie({
      metrics,
      address,
    });

    navigate("/solar-showcase", {
      state: {
        metrics,
        address,
      },
    });
  }, [metrics, address, navigate]);

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
    return <RoofCheckLoading />;
  }

  return (
    <RoofCheckContent
      address={address}
      handleRoofOutlineComplete={handleRoofOutlineComplete}
      handleFinish={handleFinish}
      paths={paths}
      metrics={metrics}
      onLog={onLog}
    />
  );
};