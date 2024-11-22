import { CloudSun } from "lucide-react";

interface ClimateEffectsProps {
  annualProduction: number;
}

export const ClimateEffects = ({ annualProduction }: ClimateEffectsProps) => {
  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
      <CloudSun className="h-8 w-8 text-blue-500" />
      <div className="text-left">
        <p className="text-2xl font-bold text-blue-600">{annualProduction.toLocaleString()} kWh</p>
        <p className="text-sm text-gray-600">Sauberer Solarstrom pro Jahr</p>
      </div>
    </div>
  );
};