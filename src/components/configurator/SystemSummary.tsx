import { Battery, Sun, Zap, ShoppingCart, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product, SystemConfig } from "./types";

interface SystemSummaryProps {
  systemConfig: SystemConfig;
  autarky: number;
  onRemoveModule: (index: number) => void;
  getTotalPrice: () => number;
}

export const SystemSummary = ({ 
  systemConfig, 
  autarky, 
  onRemoveModule, 
  getTotalPrice 
}: SystemSummaryProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ihre Konfiguration</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Sun className="h-5 w-5 text-yellow-500" /> Module
          </h3>
          {systemConfig.modules.map((module, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-lg mb-2">
              <span>{module.name}</span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemoveModule(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-blue-500" /> Wechselrichter
          </h3>
          {systemConfig.inverter ? (
            <div className="p-2 border rounded-lg">
              {systemConfig.inverter.name}
            </div>
          ) : (
            <p className="text-gray-500">Kein Wechselrichter ausgewählt</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Battery className="h-5 w-5 text-green-500" /> Speicher
          </h3>
          {systemConfig.battery ? (
            <div className="p-2 border rounded-lg">
              {systemConfig.battery.name}
            </div>
          ) : (
            <p className="text-gray-500">Kein Speicher ausgewählt</p>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Autarkiegrad:</span>
            <span className="text-2xl font-bold text-blue-600">{autarky}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Gesamtpreis:</span>
            <span className="text-2xl font-bold text-green-600">{getTotalPrice()}€</span>
          </div>
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Angebot anfordern
        </Button>
      </div>
    </Card>
  );
};