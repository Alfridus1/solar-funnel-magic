import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sun, Battery, Euro, Home, TrendingUp } from "lucide-react";

interface SavingsCalculatorProps {
  yearlyProduction: number;
}

export const SavingsCalculator = ({ yearlyProduction }: SavingsCalculatorProps) => {
  const [electricityPrice, setElectricityPrice] = useState(0.40);
  const [yearlyConsumption, setYearlyConsumption] = useState(4000);
  const SELF_CONSUMPTION_RATE = 0.90; // 90% Eigenverbrauch
  const FEED_IN_RATE = 0.09; // 9 Cent Einspeisevergütung
  const SYSTEM_COST_PER_KWP = 1950; // Durchschnittlicher Anlagenpreis pro kWp
  
  // Calculate system size in kWp (assuming 950kWh/kWp yearly production)
  const systemKWp = yearlyProduction / 950;
  
  // Determine battery size based on system size
  const getBatterySize = () => {
    if (systemKWp >= 18) return 20;
    if (systemKWp >= 12.5) return 15;
    return 10;
  };
  
  const batterySize = getBatterySize();
  const batteryContribution = Math.min(batterySize * 0.8, (yearlyConsumption / 365) * 0.5) * 365;
  
  // Calculate self-consumption and feed-in
  const maxSelfConsumption = yearlyConsumption * SELF_CONSUMPTION_RATE;
  const potentialSelfConsumption = yearlyProduction * 0.3 + batteryContribution; // 30% direct use + battery
  const selfConsumedEnergy = Math.min(maxSelfConsumption, potentialSelfConsumption);
  const feedInEnergy = yearlyProduction - selfConsumedEnergy;
  
  const yearlySavingsSelfConsumption = Math.round(selfConsumedEnergy * electricityPrice);
  const yearlySavingsFeedIn = Math.round(feedInEnergy * FEED_IN_RATE);
  const totalYearlySavings = yearlySavingsSelfConsumption + yearlySavingsFeedIn;
  const monthlySavings = Math.round(totalYearlySavings / 12);
  
  // Calculate system costs (based on kWp)
  const estimatedSystemCost = Math.round(systemKWp * SYSTEM_COST_PER_KWP);
  
  // ROI in Jahren
  const roiYears = Math.round((estimatedSystemCost / totalYearlySavings) * 10) / 10;
  
  // Calculate CO2 savings
  const co2Savings = Math.round(yearlyProduction * 0.366); // 366g CO2 per kWh
  const twentyYearSavings = totalYearlySavings * 20;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700">Jährliche Produktion:</span>
          <div className="text-right">
            <span className="font-semibold text-2xl text-solar-orange">{yearlyProduction.toLocaleString()} kWh</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="consumption">Jahresverbrauch</Label>
              <span className="font-medium text-solar-orange">{yearlyConsumption.toLocaleString()} kWh</span>
            </div>
            <Slider
              id="consumption"
              min={2000}
              max={15000}
              step={100}
              value={[yearlyConsumption]}
              onValueChange={(value) => setYearlyConsumption(value[0])}
              className="w-full"
            />
          </div>

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
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-solar-orange/10 rounded-lg">
                  <Euro className="h-5 w-5 text-solar-orange" />
                </div>
                <span className="text-gray-600">Monatliche Ersparnis</span>
              </div>
              <span className="text-2xl font-bold text-solar-orange">{monthlySavings}€</span>
              <div className="mt-2 text-sm text-gray-500">
                <div>Eigenverbrauch: {Math.round(selfConsumedEnergy)} kWh</div>
                <div>Einspeisung: {Math.round(feedInEnergy)} kWh</div>
                <div>Speichergröße: {batterySize} kWh</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-solar-orange/10 rounded-lg">
                  <Battery className="h-5 w-5 text-solar-orange" />
                </div>
                <span className="text-gray-600">Jährliche Ersparnis</span>
              </div>
              <span className="text-2xl font-bold text-solar-orange">{totalYearlySavings}€</span>
              <div className="mt-2 text-sm text-gray-500">
                <div>Durch Eigenverbrauch: {yearlySavingsSelfConsumption}€</div>
                <div>Durch Einspeisung: {yearlySavingsFeedIn}€</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-gray-600">Return on Investment</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{roiYears} Jahre</span>
              <div className="mt-2 text-sm text-gray-500">
                <div>Anlagenkosten: {estimatedSystemCost.toLocaleString()}€</div>
                <div>Jährliche Rendite: {Math.round((1 / roiYears) * 100)}%</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-600">20 Jahre Ersparnis</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{twentyYearSavings.toLocaleString()}€</span>
              <div className="mt-2 text-sm text-gray-500">
                <div>CO₂-Einsparung: {co2Savings} kg/Jahr</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};