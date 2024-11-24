import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Battery, Euro, Home, Sun, TrendingUp } from "lucide-react";

interface SavingsCalculatorProps {
  yearlyProduction: number;
}

export const SavingsCalculator = ({ yearlyProduction }: SavingsCalculatorProps) => {
  const [electricityPrice, setElectricityPrice] = useState(0.40);
  const [yearlyConsumption, setYearlyConsumption] = useState(4000);
  const SELF_CONSUMPTION_RATE = 0.90;
  const FEED_IN_RATE = 0.09;
  const SYSTEM_COST_PER_KWP = 1950;
  
  const systemKWp = yearlyProduction / 950;
  
  const getBatterySize = () => {
    if (systemKWp >= 18) return 20;
    if (systemKWp >= 12.5) return 15;
    return 10;
  };
  
  const batterySize = getBatterySize();
  const batteryContribution = Math.min(batterySize * 0.8, (yearlyConsumption / 365) * 0.5) * 365;
  
  const maxSelfConsumption = yearlyConsumption * SELF_CONSUMPTION_RATE;
  const potentialSelfConsumption = yearlyProduction * 0.3 + batteryContribution;
  const selfConsumedEnergy = Math.min(maxSelfConsumption, potentialSelfConsumption);
  const feedInEnergy = yearlyProduction - selfConsumedEnergy;
  
  const yearlySavingsSelfConsumption = Math.round(selfConsumedEnergy * electricityPrice);
  const yearlySavingsFeedIn = Math.round(feedInEnergy * FEED_IN_RATE);
  const totalYearlySavings = yearlySavingsSelfConsumption + yearlySavingsFeedIn;
  const monthlySavings = Math.round(totalYearlySavings / 12);
  
  const estimatedSystemCost = Math.round(systemKWp * SYSTEM_COST_PER_KWP);
  const roiYears = Math.round((estimatedSystemCost / totalYearlySavings) * 10) / 10;
  const thirtyYearSavings = totalYearlySavings * 30;

  return (
    <div className="w-full xl:w-3/4 mx-auto space-y-8 p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 bg-white/90 backdrop-blur transition-all hover:shadow-lg">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="consumption" className="text-lg font-medium">Jahresverbrauch</Label>
                <span className="text-xl font-semibold text-blue-600">{yearlyConsumption.toLocaleString()} kWh</span>
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
                <Label htmlFor="electricity-price" className="text-lg font-medium">Strompreis</Label>
                <span className="text-xl font-semibold text-blue-600">{electricityPrice.toFixed(2)}€/kWh</span>
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
          </div>
        </Card>

        <Card className="p-8 bg-white/90 backdrop-blur transition-all hover:shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Battery className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Speichergröße</p>
                <p className="text-xl font-semibold">{batterySize} kWh</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Sun className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Eigenverbrauch</p>
                <p className="text-xl font-semibold">{Math.round(selfConsumedEnergy).toLocaleString()} kWh</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100">
                <Home className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Netzeinspeisung</p>
                <p className="text-xl font-semibold">{Math.round(feedInEnergy).toLocaleString()} kWh</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white transition-all hover:shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Euro className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-gray-600 font-medium">Monatliche Ersparnis</span>
          </div>
          <span className="text-3xl font-bold text-blue-600">{monthlySavings}€</span>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white transition-all hover:shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Battery className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-gray-600 font-medium">Jährliche Ersparnis</span>
          </div>
          <span className="text-3xl font-bold text-green-600">{totalYearlySavings}€</span>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white transition-all hover:shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-gray-600 font-medium">Amortisationszeit</span>
          </div>
          <span className="text-3xl font-bold text-orange-600">{roiYears} Jahre</span>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white transition-all hover:shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Home className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-gray-600 font-medium">30 Jahre Ersparnis</span>
          </div>
          <span className="text-3xl font-bold text-purple-600">{thirtyYearSavings.toLocaleString()}€</span>
        </Card>
      </div>
    </div>
  );
};