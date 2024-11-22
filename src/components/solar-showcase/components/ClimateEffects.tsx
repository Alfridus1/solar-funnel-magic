import { Leaf, CloudSun } from "lucide-react";

interface ClimateEffectsProps {
  co2Savings: number;
  annualProduction: number;
}

export const ClimateEffects = ({ co2Savings, annualProduction }: ClimateEffectsProps) => {
  // Calculate CO2 savings using 690g CO2 per kWh
  const calculatedCO2Savings = Math.round(annualProduction * 0.69); // 690g = 0.69kg CO₂-Äquivalente pro kWh

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-lg">
        <Leaf className="h-8 w-8 text-green-500" />
        <div className="text-left">
          <p className="text-2xl font-bold text-green-600">{calculatedCO2Savings.toLocaleString()} kg</p>
          <p className="text-sm text-gray-600">CO₂-Äquivalente pro Jahr</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
        <CloudSun className="h-8 w-8 text-blue-500" />
        <div className="text-left">
          <p className="text-2xl font-bold text-blue-600">{annualProduction.toLocaleString()} kWh</p>
          <p className="text-sm text-gray-600">Sauberer Solarstrom pro Jahr</p>
        </div>
      </div>
    </div>
  );
};