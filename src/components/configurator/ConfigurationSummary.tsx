import { Card } from "@/components/ui/card";
import { Sun, Battery, Home, Ruler, Zap } from "lucide-react";

interface ConfigurationSummaryProps {
  metrics: {
    monthlyProduction: number;
    annualSavings: number;
    roofArea: number;
    possiblePanels: number;
    kWp: number;
  };
  address: string;
}

export const ConfigurationSummary = ({ metrics, address }: ConfigurationSummaryProps) => {
  return (
    <Card className="p-4 sm:p-6 mb-4 sm:mb-8 w-full">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Empfohlene Konfiguration</h2>
        <p className="text-sm sm:text-base text-gray-600">{address}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <Sun className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Monatliche Produktion</p>
            <p className="text-base sm:text-lg font-bold">{metrics.monthlyProduction} kWh</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <Battery className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Jährliche Einsparungen</p>
            <p className="text-base sm:text-lg font-bold">{metrics.annualSavings}€</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Anlagenleistung</p>
            <p className="text-base sm:text-lg font-bold">{metrics.kWp} kWp</p>
          </div>
        </div>
      </div>
    </Card>
  );
};