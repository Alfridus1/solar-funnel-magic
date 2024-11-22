import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sun, Battery, Leaf, Euro, Home } from "lucide-react";

interface SavingsCalculatorProps {
  yearlyProduction: number;
}

export const SavingsCalculator = ({ yearlyProduction }: SavingsCalculatorProps) => {
  const [electricityPrice, setElectricityPrice] = useState(0.40);
  const yearlySavings = Math.round(yearlyProduction * electricityPrice);
  const monthlySavings = Math.round(yearlySavings / 12);
  
  // Calculate additional metrics
  const co2Savings = Math.round(yearlyProduction * 0.366); // 366g CO2 per kWh
  const treesEquivalent = Math.round(co2Savings / 21000); // Average tree absorbs 21kg CO2 per year
  const twentyYearSavings = yearlySavings * 20;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-white to-solar-blue-50">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700">Jährliche Produktion:</span>
          <div className="text-right">
            <span className="font-semibold text-2xl text-solar-orange">{yearlyProduction.toLocaleString()} kWh</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="electricity-price">Strompreis</Label>
              <span className="font-medium text-solar-orange">{electricityPrice.toFixed(2)}€/kWh</span>
            </div>
            <Slider
              id="electricity-price"
              min={0.20}
              max={0.60}
              step={0.01}
              value={[electricityPrice]}
              onValueChange={(value) => setElectricityPrice(value[0])}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-solar-orange/10 rounded-lg">
                  <Euro className="h-5 w-5 text-solar-orange" />
                </div>
                <span className="text-gray-600">Monatliche Ersparnis</span>
              </div>
              <span className="text-2xl font-bold text-solar-orange">{monthlySavings}€</span>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-solar-orange/10 rounded-lg">
                  <Battery className="h-5 w-5 text-solar-orange" />
                </div>
                <span className="text-gray-600">Jährliche Ersparnis</span>
              </div>
              <span className="text-2xl font-bold text-solar-orange">{yearlySavings}€</span>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-gray-600">CO₂-Einsparung/Jahr</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{co2Savings} kg</span>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-600">20 Jahre Ersparnis</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{twentyYearSavings.toLocaleString()}€</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};