import { FC } from "react";
import { RoofDesigner } from "@/components/roof/RoofDesigner";
import { RoofMetrics } from "@/components/roof/RoofMetrics";

interface RoofCheckContentProps {
  address?: string;
  onRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
  onFinish: () => void;
  paths: google.maps.LatLng[][];
  metrics: {
    monthlyProduction: number;
    annualSavings: number;
    roofArea: number;
    possiblePanels: number;
    kWp: number;
    roofDetails: any[];
  };
  onLog?: (message: string) => void;
}

export const RoofCheckContent: FC<RoofCheckContentProps> = ({
  address,
  onRoofOutlineComplete,
  onFinish,
  paths,
  metrics,
  onLog
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="lg:col-span-2">
          <RoofDesigner
            address={address}
            onRoofOutlineComplete={onRoofOutlineComplete}
            onLog={onLog}
          />
        </div>
        <div>
          <RoofMetrics
            monthlyProduction={metrics.monthlyProduction}
            annualSavings={metrics.annualSavings}
            roofArea={metrics.roofArea}
            possiblePanels={metrics.possiblePanels}
            kWp={metrics.kWp}
            roofDetails={metrics.roofDetails}
            onContinue={onFinish}
          />
        </div>
      </div>
    </div>
  );
};