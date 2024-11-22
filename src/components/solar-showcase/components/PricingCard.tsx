import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Wrench, Clock, Package } from "lucide-react";

interface PricingCardProps {
  estimatedPrice: number;
  onShowLeadForm: () => void;
  systemSizeKWp: number;
}

export const PricingCard = ({ estimatedPrice, onShowLeadForm, systemSizeKWp }: PricingCardProps) => {
  const getBatterySize = () => {
    if (systemSizeKWp >= 18) return 20;
    if (systemSizeKWp >= 12.5) return 15;
    return 10;
  };

  const batterySize = getBatterySize();

  return (
    <Card className="p-6 bg-gradient-to-br from-solar-orange/10 to-white">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-lg mb-1">Premium Komponenten</h4>
            <p className="text-gray-600">
              Hochwertige Module, Wechselrichter und ein <span className="font-bold">{batterySize} kWh</span> Speicher für maximale Unabhängigkeit
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Wrench className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-lg mb-1">Komplette Installation</h4>
            <p className="text-gray-600">Professionelle DC und AC Installation inklusive neuem Zählerschrank nach aktuellen Standards</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Clock className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-lg mb-1">Schnelle Umsetzung</h4>
            <p className="text-gray-600">Von der Planung bis zur Inbetriebnahme - alles aus einer Hand</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Package className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-lg mb-1">Rundum-Sorglos-Paket</h4>
            <p className="text-gray-600">Inklusive aller Genehmigungen, Anmeldungen und Dokumentation</p>
          </div>
        </div>
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
          <p className="text-4xl font-bold text-solar-orange mb-2">{estimatedPrice.toLocaleString()}€</p>
          <p className="text-sm text-gray-500 mb-4">Komplett-Installation inkl. MwSt.</p>
          <Button 
            className="w-full bg-solar-orange hover:bg-solar-orange-dark text-xl py-6"
            onClick={onShowLeadForm}
          >
            Vor-Ort Termin vereinbaren
          </Button>
        </div>
      </div>
    </Card>
  );
};