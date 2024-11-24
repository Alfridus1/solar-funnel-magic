import { Card } from "@/components/ui/card";

interface RoofDetail {
  roofId: string;
  moduleCount: number;
}

interface RoofMetricsProps {
  monthlyProduction: number;
  annualSavings: number;
  roofArea: number;
  possiblePanels: number;
  kWp: number;
  roofDetails: RoofDetail[];
}

export const RoofMetrics = ({
  monthlyProduction,
  annualSavings,
  roofArea,
  possiblePanels,
  kWp,
  roofDetails,
}: RoofMetricsProps) => {
  // Component rendered empty for now as requested
  return null;
};