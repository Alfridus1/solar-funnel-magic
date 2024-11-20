import { Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";

export const SavingsCalculator = ({ yearlyProduction }: { yearlyProduction: number }) => {
  const electricityPrice = 0.40; // €/kWh
  const yearlySavings = yearlyProduction * electricityPrice;
  const twentyYearSavings = yearlySavings * 20;

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-solar-orange-50 to-white/80 backdrop-blur">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-solar-orange" />
        <h3 className="text-lg sm:text-xl font-semibold">Ihre Einsparungen</h3>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center p-2 sm:p-3 bg-white/50 rounded-lg text-sm sm:text-base">
          <span>Jährliche Produktion:</span>
          <span className="font-semibold">{yearlyProduction.toLocaleString()} kWh</span>
        </div>
        
        <div className="flex justify-between items-center p-2 sm:p-3 bg-white/50 rounded-lg text-sm sm:text-base">
          <span>Strompreis:</span>
          <span className="font-semibold">{electricityPrice.toFixed(2)} €/kWh</span>
        </div>
        
        <div className="flex justify-between items-center p-2 sm:p-3 bg-solar-orange-50 rounded-lg text-sm sm:text-base">
          <span>Jährliche Einsparung:</span>
          <span className="font-semibold text-solar-orange">{yearlySavings.toLocaleString()} €</span>
        </div>
        
        <div className="flex justify-between items-center p-2 sm:p-3 bg-solar-orange-100 rounded-lg text-sm sm:text-base">
          <span>Einsparung über 20 Jahre:</span>
          <span className="font-semibold text-solar-orange-600">{twentyYearSavings.toLocaleString()} €</span>
        </div>
      </div>
    </Card>
  );
};