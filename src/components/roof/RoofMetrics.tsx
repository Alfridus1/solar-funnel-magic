import { Card } from "@/components/ui/card";
import { Sun, Battery, Home, Ruler, Zap } from "lucide-react";

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
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <Sun className="h-8 w-8 text-yellow-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Monatliche Produktion</p>
              <p className="text-lg font-bold truncate">{monthlyProduction} kWh</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <Battery className="h-8 w-8 text-green-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Jährliche Einsparungen</p>
              <p className="text-lg font-bold truncate">{annualSavings}€</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <Home className="h-8 w-8 text-blue-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Nutzbare Dachfläche</p>
              <p className="text-lg font-bold truncate">{roofArea}m²</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <Ruler className="h-8 w-8 text-purple-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Mögliche Module</p>
              <p className="text-lg font-bold truncate">{possiblePanels} Stück</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-orange-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Anlagenleistung</p>
              <p className="text-lg font-bold truncate">{kWp} kWp</p>
            </div>
          </div>
        </Card>
      </div>

      {roofDetails.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Module pro Dachfläche</h3>
          <div className="space-y-2">
            {roofDetails.map((detail, index) => (
              <div key={detail.roofId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">Dachfläche {index + 1}</span>
                <span className="text-blue-600 font-semibold">{detail.moduleCount} Module</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};