import { Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ConsumptionInputProps {
  yearlyConsumption: number;
  onChange: (value: number) => void;
}

export const ConsumptionInput = ({ yearlyConsumption, onChange }: ConsumptionInputProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ihr Stromverbrauch</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Zap className="h-6 w-6 text-yellow-500" />
          <Input
            type="number"
            value={yearlyConsumption}
            onChange={(e) => onChange(Number(e.target.value))}
            className="max-w-xs"
            placeholder="Jährlicher Verbrauch in kWh"
          />
        </div>
      </div>
    </Card>
  );
};