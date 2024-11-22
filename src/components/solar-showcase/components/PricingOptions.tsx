import { CreditCard, Wallet, Shield, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PricingOptionsProps {
  estimatedPrice: number;
  onShowQuoteForm: () => void;
  onShowConsultationForm: () => void;
}

export const PricingOptions = ({
  estimatedPrice,
  onShowQuoteForm,
  onShowConsultationForm,
}: PricingOptionsProps) => {
  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 bg-gradient-to-br from-solar-orange/5 to-white hover:shadow-lg transition-all">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Wallet className="h-8 w-8 text-solar-orange" />
              <h3 className="text-2xl font-bold">KAUFEN</h3>
            </div>
            <ul className="space-y-4">
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
              <p className="text-3xl font-bold text-solar-orange mb-2">{estimatedPrice.toLocaleString()}€</p>
              <Button 
                className="w-full bg-solar-orange hover:bg-solar-orange-dark text-xl"
                onClick={onShowQuoteForm}
              >
                Jetzt kaufen
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-blue-500/5 to-white hover:shadow-lg transition-all">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-blue-500" />
              <h3 className="text-2xl font-bold">COPPEN Flex</h3>
            </div>
            <ul className="space-y-4">
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
              <p className="text-3xl font-bold text-blue-500 mb-2">ab {Math.round(estimatedPrice / 240).toLocaleString()}€/Monat</p>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-xl"
                onClick={onShowConsultationForm}
              >
                Finanzierung anfragen
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};