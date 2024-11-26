import { FC, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RoofDesigner } from "@/components/roof/RoofDesigner";
import { RoofMetrics } from "@/components/roof/RoofMetrics";
import { calculateRoofArea, calculateSolarMetrics } from "@/utils/roofCalculations";
import { saveConfigToCookie } from "@/utils/configCookieManager";

interface RoofCheckContentProps {
  address?: string;
  onLog?: (message: string) => void;
}

export const RoofCheckContent: FC<RoofCheckContentProps> = ({ address, onLog }) => {
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
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="lg:col-span-2">
          <RoofDesigner
            address={address}
            onRoofOutlineComplete={handleRoofOutlineComplete}
            onLog={onLog}
          />
        </div>
        <div>
          <RoofMetrics
            metrics={metrics}
            onFinish={handleFinish}
            paths={paths}
          />
        </div>
      </div>
    </div>
  );
};