import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SavingsCalculatorProps {
  yearlyProduction: number;
}

export const SavingsCalculator = ({ yearlyProduction }: SavingsCalculatorProps) => {
  const [electricityPrice, setElectricityPrice] = useState(0.40);
  const yearlySavings = Math.round(yearlyProduction * electricityPrice);
  const monthlySavings = Math.round(yearlySavings / 12);

  // Calculate system size in kWp (assuming 950 kWh/kWp annual production)
  const estimatedKWp = yearlyProduction / 950;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700">Jährliche Produktion:</span>
          <div className="text-right">
            <span className="font-semibold text-lg">{yearlyProduction.toLocaleString()} kWh</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="electricity-price">Strompreis (€/kWh)</Label>
            <Input
              id="electricity-price"
              type="number"
              step="0.01"
              min="0"
              value={electricityPrice}
              onChange={(e) => setElectricityPrice(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span>Monatliche Ersparnis:</span>
            <span className="font-semibold text-lg">{monthlySavings}€</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Jährliche Ersparnis:</span>
            <span className="font-semibold text-lg">{yearlySavings}€</span>
          </div>
        </div>
      </Card>
    </div>
  );
};