import { Card } from "@/components/ui/card";
import { Sun, Battery, Home, Ruler } from "lucide-react";

interface RoofMetricsProps {
  monthlyProduction: number;
  annualSavings: number;
  roofArea: number;
  possiblePanels: number;
}

export const RoofMetrics = ({
  monthlyProduction,
  annualSavings,
  roofArea,
  possiblePanels,
}: RoofMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="flex items-center space-x-4">
        <Sun className="h-8 w-8 text-yellow-500" />
        <div>
          <p className="text-sm text-gray-500">Monatliche Produktion</p>
          <p className="text-xl font-bold">{monthlyProduction} kWh</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Battery className="h-8 w-8 text-green-500" />
        <div>
          <p className="text-sm text-gray-500">Jährliche Einsparungen</p>
          <p className="text-xl font-bold">{annualSavings}€</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Home className="h-8 w-8 text-blue-500" />
        <div>
          <p className="text-sm text-gray-500">Nutzbare Dachfläche</p>
          <p className="text-xl font-bold">{roofArea}m²</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Ruler className="h-8 w-8 text-purple-500" />
        <div>
          <p className="text-sm text-gray-500">Mögliche Module</p>
          <p className="text-xl font-bold">{possiblePanels} Stück</p>
        </div>
      </div>
    </div>
  );
};