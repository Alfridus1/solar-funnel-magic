import { useState } from "react";
import { Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

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
  
  // Calculate CO2 savings (0.366 kg CO2 per kWh)
  const yearlyCO2Savings = Math.round(yearlyProduction * 0.366 / 1000); // Convert to tons

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-solar-orange" />
          <h3 className="text-lg sm:text-xl font-semibold">Ihre Potentialanalyse</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 sm:p-3 bg-white/50 rounded-lg text-sm sm:text-base">
            <span>Jährliche Produktion:</span>
            <div className="text-right">
              <span className="font-semibold">{yearlyProduction.toLocaleString()} kWh</span>
              <div className="text-sm text-green-600">≈ {yearlyCO2Savings} Tonnen CO₂ Einsparung/Jahr</div>
            </div>
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
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-solar-blue" />
          <h3 className="text-lg sm:text-xl font-semibold">Unverbindliches Angebot</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/50 rounded-lg">
            <div className="text-2xl font-bold text-solar-blue mb-2">
              {estimatedPrice.toLocaleString()} €
            </div>
            <div className="text-sm text-gray-600">Geschätzter Anlagenpreis inkl. MwSt.</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-solar-blue mt-1.5" />
              <span>Premium Komponenten von führenden Herstellern</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-solar-blue mt-1.5" />
              <span>Professionelle Installation durch zertifizierte Partner</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-solar-blue mt-1.5" />
              <span>25 Jahre Leistungsgarantie auf Module</span>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full bg-solar-blue hover:bg-solar-blue-600">
              Vor-Ort Termin vereinbaren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};