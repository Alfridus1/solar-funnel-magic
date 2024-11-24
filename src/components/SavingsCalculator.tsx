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
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-center">
        Ihre Solaranlage
      </h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Sun,
            value: `${systemKWp} kWp`,
            label: "Anlagenleistung",
            color: "text-amber-500",
            bgColor: "bg-amber-50",
          },
          {
            icon: Battery,
            value: `${yearlyProduction.toLocaleString()} kWh`,
            label: "Jährliche Produktion",
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
          },
          {
            icon: TrendingUp,
            value: `${monthlySavings}€`,
            label: "Monatliche Ersparnis",
            color: "text-blue-500",
            bgColor: "bg-blue-50",
          },
        ].map((metric, index) => (
          <Card key={index} className={`p-6 transition-shadow hover:shadow-lg ${metric.bgColor} border-none`}>
            <metric.icon className={`h-8 w-8 mb-4 ${metric.color}`} />
            <div className="space-y-1">
              <p className="text-3xl font-bold">{metric.value}</p>
              <p className="text-gray-600">{metric.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Card className="p-6 bg-gradient-to-br from-solar-blue-50 to-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Euro className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <span className="text-gray-600 font-medium">Monatliche Ersparnis</span>
              <p className="text-2xl font-bold text-blue-600">{monthlySavings}€</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Battery className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <span className="text-gray-600 font-medium">Jährliche Ersparnis</span>
              <p className="text-2xl font-bold text-green-600">{totalYearlySavings}€</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <span className="text-gray-600 font-medium">Amortisationszeit</span>
              <p className="text-2xl font-bold text-orange-600">{roiYears} Jahre</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Home className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <span className="text-gray-600 font-medium">30 Jahre Ersparnis</span>
              <p className="text-2xl font-bold text-purple-600">{thirtyYearSavings.toLocaleString()}€</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};