import { FC, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RoofCheckContent } from "./RoofCheckContent";
import { calculateRoofArea, calculateSolarMetrics } from "@/utils/roofCalculations";
import { saveConfigToCookie } from "@/utils/configCookieManager";

interface RoofCheckProps {
  address?: string;
  onLog?: (message: string) => void;
}

export const RoofCheck: FC<RoofCheckProps> = ({ address, onLog }) => {
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
      onLog?.("Roof outline completed");
    },
    [onLog]
  );

  const handleFinish = useCallback(() => {
    saveConfigToCookie({
      metrics,
      address,
    });

    onLog?.("Configuration saved");
    navigate("/solar-showcase", {
      state: {
        metrics,
        address,
      },
    });
  }, [metrics, address, navigate, onLog]);

  return (
    <RoofCheckContent
      address={address || ""}
      handleRoofOutlineComplete={handleRoofOutlineComplete}
      handleFinish={handleFinish}
      paths={paths}
      metrics={metrics}
      onLog={onLog}
    />
  );
};