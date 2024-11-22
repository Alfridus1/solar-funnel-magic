import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <div>
            <Label htmlFor="electricity-price">Strompreis (€/kWh)</Label>
            <Input
              id="electricity-price"
              type="number"
              step="0.01"
              min="0"
              value={electricityPrice}
              onChange={(e) => setElectricityPrice(Number(e.target.value))}
              className="bg-white/50 backdrop-blur-sm"
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
              <p className="text-sm text-gray-500 mt-1">≈ {treesEquivalent} Bäume pro Jahr</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-600">20 Jahre Ersparnis</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{twentyYearSavings.toLocaleString()}€</span>
              <p className="text-sm text-gray-500 mt-1">Bei gleichem Strompreis</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};