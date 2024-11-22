import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Euro } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Euro className="h-5 w-5 text-solar-orange" />
          <span className="text-2xl font-bold">{options.price.toLocaleString()}€</span>
        </div>
      </div>
      
      {options.financing.available && (
        <div className="text-sm text-gray-600">
          <p>Flexible Finanzierung verfügbar</p>
          <p>Ab {options.financing.min_rate}% für bis zu {options.financing.max_term} Monate</p>
        </div>
      )}
      
      <Button 
        onClick={onRequestQuote}
        className="w-full bg-solar-orange hover:bg-solar-orange-dark"
      >
        Angebot anfordern
      </Button>
    </div>
  );
};