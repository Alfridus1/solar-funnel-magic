import { Leaf, CloudSun } from "lucide-react";

interface ClimateEffectsProps {
  co2Savings: number;
  annualProduction: number;
}

export const ClimateEffects = ({ co2Savings, annualProduction }: ClimateEffectsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-lg">
        <Leaf className="h-8 w-8 text-green-500" />
        <div className="text-left">
          <p className="text-2xl font-bold text-green-600">{co2Savings.toLocaleString()} kg</p>
          <p className="text-sm text-gray-600">CO₂-Einsparung pro Jahr</p>
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