import { Card } from "@/components/ui/card";
import { Sun, Home, Zap, Battery } from "lucide-react";

interface SystemMetricsProps {
  moduleCount: number;
  kWp: number;
  annualProduction: number;
  roofArea: number;
}

export const SystemMetrics = ({ moduleCount, kWp, annualProduction, roofArea }: SystemMetricsProps) => {
  // Berechne kWp direkt aus der Modulanzahl (jedes Modul = 0,5 kWp)
  const calculatedKWp = moduleCount * 0.5;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <Sun className="h-5 w-5" />
          <span className="text-sm font-medium">Dachfläche</span>
        </div>
        <p className="text-2xl font-bold">{roofArea}m²</p>
        <p className="text-sm text-gray-600">Nutzbare Fläche</p>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Home className="h-5 w-5" />
          <span className="text-sm font-medium">Module</span>
        </div>
        <p className="text-2xl font-bold">{moduleCount} Stück</p>
        <p className="text-sm text-gray-600">500W Full Black</p>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <Zap className="h-5 w-5" />
          <span className="text-sm font-medium">Anlagengröße</span>
        </div>
        <p className="text-2xl font-bold">{calculatedKWp.toFixed(1)} kWp</p>
        <p className="text-sm text-gray-600">Gesamtleistung</p>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl">
        <div className="flex items-center gap-2 text-purple-600 mb-2">
          <Battery className="h-5 w-5" />
          <span className="text-sm font-medium">Jahresertrag</span>
        </div>
        <p className="text-2xl font-bold">{annualProduction} kWh</p>
        <p className="text-sm text-gray-600">pro Jahr</p>
      </Card>
    </div>
  );
};