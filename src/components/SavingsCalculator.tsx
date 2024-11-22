import { useState } from "react";
import { Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export const SavingsCalculator = ({ yearlyProduction }: { yearlyProduction: number }) => {
  const [electricityPrice, setElectricityPrice] = useState(0.40); // €/kWh
  const yearlySavings = yearlyProduction * electricityPrice;
  
  // Calculate 25 year savings with 4.5% annual price increase
  const twentyFiveYearSavings = Array.from({ length: 25 }).reduce<number>((total, _, index) => {
    const priceWithIncrease = electricityPrice * Math.pow(1.045, index);
    return total + (yearlyProduction * priceWithIncrease);
  }, 0);

  // Calculate system size in kWp (assuming 950 kWh/kWp annual production)
  const estimatedKWp = yearlyProduction / 950;
  
  // Calculate CO2 savings (690g = 0.69kg CO2 per kWh)
  const yearlyCO2Savings = Math.round(yearlyProduction * 0.69 / 1000); // Convert to tons

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl shadow-sm">
          <span className="text-gray-700">Jährliche Produktion:</span>
          <div className="text-right">
            <span className="font-semibold text-lg">{yearlyProduction.toLocaleString()} kWh</span>
            <div className="text-sm text-green-600">≈ {yearlyCO2Savings} Tonnen CO₂-Äquivalente/Jahr</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-gray-700">
            <span>Strompreis:</span>
            <span className="font-semibold">{electricityPrice.toFixed(2)} €/kWh</span>
          </div>
          <Slider
            value={[electricityPrice]}
            onValueChange={(values) => setElectricityPrice(values[0])}
            min={0.25}
            max={0.60}
            step={0.01}
            className="my-4"
          />
        </div>

        <div className="flex justify-between items-center p-4 bg-solar-orange-50 rounded-xl shadow-sm">
          <span className="text-gray-700">Anlagengröße:</span>
          <span className="font-semibold text-solar-orange text-lg">{estimatedKWp.toFixed(1)} kWp</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-solar-orange-50 rounded-xl shadow-sm">
          <span className="text-gray-700">Jährliche Einsparung:</span>
          <span className="font-semibold text-solar-orange text-lg">{Math.round(yearlySavings).toLocaleString()} €</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-solar-orange-100 rounded-xl shadow-sm">
          <span className="text-gray-700">Einsparung über 25 Jahre:</span>
          <span className="font-semibold text-solar-orange-600 text-lg">
            {Math.round(twentyFiveYearSavings).toLocaleString()} €
          </span>
        </div>
      </div>
    </div>
  );
};