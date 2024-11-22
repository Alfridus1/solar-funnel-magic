import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Package, Clock, CreditCard, Wallet } from "lucide-react";

interface PricingOptionsProps {
  estimatedPrice: number;
  onQuoteRequest: () => void;
  onConsultationRequest: () => void;
}

export const PricingOptions = ({ estimatedPrice, onQuoteRequest, onConsultationRequest }: PricingOptionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card className="p-6 bg-gradient-to-br from-solar-orange/10 to-white hover:shadow-lg transition-all">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Wallet className="h-8 w-8 text-solar-orange" />
            <h3 className="text-xl font-bold">KAUFEN</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-solar-orange flex-shrink-0 mt-1" />
              <span>Einmalige Investition</span>
            </li>
            <li className="flex items-start gap-3">
              <Package className="h-5 w-5 text-solar-orange flex-shrink-0 mt-1" />
              <span>Sofortige Eigentumsübertragung</span>
            </li>
          </ul>
          <div className="pt-4">
            <p className="text-2xl font-bold text-solar-orange mb-2">{estimatedPrice.toLocaleString()}€</p>
            <Button 
              className="w-full bg-solar-orange hover:bg-solar-orange-dark"
              onClick={onQuoteRequest}
            >
              Jetzt kaufen
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-white hover:shadow-lg transition-all">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-blue-500" />
            <h3 className="text-xl font-bold">COPPEN Flex</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
              <span>Flexible Finanzierung ab 0% Zinsen</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
              <span>Laufzeiten bis zu 20 Jahre</span>
            </li>
          </ul>
          <div className="pt-4">
            <p className="text-2xl font-bold text-blue-500 mb-2">ab {Math.round(estimatedPrice / 240).toLocaleString()}€/Monat</p>
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={onConsultationRequest}
            >
              Finanzierung anfragen
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};