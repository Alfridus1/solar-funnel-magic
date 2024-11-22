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
  const estimatedPrice = Math.round(estimatedKWp * 1950);

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-solar-orange-50 to-white/80 backdrop-blur">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-solar-orange" />
        <h3 className="text-lg sm:text-xl font-semibold">Ihre Potentialanalyse</h3>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center p-2 sm:p-3 bg-white/50 rounded-lg text-sm sm:text-base">
          <span>Jährliche Produktion:</span>
          <span className="font-semibold">{yearlyProduction.toLocaleString()} kWh</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm sm:text-base">
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

        <div className="flex justify-between items-center p-2 sm:p-3 bg-solar-orange-50 rounded-lg text-sm sm:text-base">
          <span>Anlagengröße:</span>
          <span className="font-semibold text-solar-orange">{estimatedKWp.toFixed(1)} kWp</span>
        </div>
        
        <div className="flex justify-between items-center p-2 sm:p-3 bg-solar-orange-50 rounded-lg text-sm sm:text-base">
          <span>Jährliche Einsparung:</span>
          <span className="font-semibold text-solar-orange">{Math.round(yearlySavings).toLocaleString()} €</span>
        </div>
        
        <div className="flex justify-between items-center p-2 sm:p-3 bg-solar-orange-100 rounded-lg text-sm sm:text-base">
          <span>Einsparung über 25 Jahre:</span>
          <span className="font-semibold text-solar-orange-600">
            {Math.round(twentyFiveYearSavings).toLocaleString()} €
          </span>
        </div>

        <div className="flex justify-between items-center p-2 sm:p-3 bg-solar-orange-50 rounded-lg text-sm sm:text-base">
          <span>Unverbindliche Preisschätzung:</span>
          <span className="font-semibold text-solar-orange">{estimatedPrice.toLocaleString()} €</span>
        </div>
      </div>
    </Card>
  );
};