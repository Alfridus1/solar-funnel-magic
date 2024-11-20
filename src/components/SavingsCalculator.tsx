import { Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";

export const SavingsCalculator = ({ yearlyProduction }: { yearlyProduction: number }) => {
  const electricityPrice = 0.40; // €/kWh
  const yearlySavings = yearlyProduction * electricityPrice;
  const twentyYearSavings = yearlySavings * 20;

  return (
    <Card className="p-6 bg-gradient-to-br from-solar-orange-50 to-white/80 backdrop-blur">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 text-solar-orange" />
        <h3 className="text-xl font-semibold">Ihre Einsparungen</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
          <span>Jährliche Produktion:</span>
          <span className="font-semibold">{yearlyProduction.toLocaleString()} kWh</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
          <span>Strompreis:</span>
          <span className="font-semibold">{electricityPrice.toFixed(2)} €/kWh</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-solar-orange-50 rounded-lg">
          <span>Jährliche Einsparung:</span>
          <span className="font-semibold text-solar-orange">{yearlySavings.toLocaleString()} €</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-solar-orange-100 rounded-lg">
          <span>Einsparung über 20 Jahre:</span>
          <span className="font-semibold text-solar-orange-600">{twentyYearSavings.toLocaleString()} €</span>
        </div>
      </div>
    </Card>
  );
};