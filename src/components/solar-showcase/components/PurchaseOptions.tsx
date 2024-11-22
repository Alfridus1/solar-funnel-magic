import { Button } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { Euro, Percent, Calendar, CreditCard } from "lucide-react";

interface PurchaseOptionsProps {
  options: {
    price: number;
    financing: {
      available: boolean;
      min_rate: number;
      max_term: number;
    };
  };
  onRequestQuote: () => void;
}

export const PurchaseOptions = ({ options, onRequestQuote }: PurchaseOptionsProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-solar-blue-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Euro className="h-6 w-6 text-solar-orange" />
            <span className="text-3xl font-bold">{options.price.toLocaleString()}€</span>
          </div>
          <div className="text-sm text-gray-600">
            inkl. MwSt.
          </div>
        </div>
        
        {options.financing.available && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-green-600">
              <Percent className="h-5 w-5" />
              <span className="font-semibold">0% Finanzierung verfügbar</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-solar-orange" />
                <div className="text-sm">
                  <p className="font-medium">Laufzeit</p>
                  <p className="text-gray-600">bis {options.financing.max_term} Monate</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-solar-orange" />
                <div className="text-sm">
                  <p className="font-medium">Rate</p>
                  <p className="text-gray-600">ab {(options.price / options.financing.max_term).toFixed(2)}€/Monat</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button 
            onClick={onRequestQuote}
            className="w-full bg-solar-orange hover:bg-solar-orange-dark text-white font-semibold py-3"
          >
            Jetzt Angebot anfordern
          </Button>
          {options.financing.available && (
            <Button 
              variant="outline"
              onClick={onRequestQuote}
              className="w-full border-solar-orange text-solar-orange hover:bg-solar-orange/10"
            >
              Finanzierung berechnen
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};