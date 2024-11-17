import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Battery, 
  HomeIcon, 
  ChargingPile, 
  Calendar,
  Mail
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ConfigurationSummary } from "@/components/configurator/ConfigurationSummary";
import { Extras } from "@/components/configurator/Extras";
import { LeadForm } from "@/components/LeadForm";

export const RecommendedConfig = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formType, setFormType] = useState<"quote" | "consultation" | null>(null);
  
  const { metrics, address } = location.state || {};

  if (!metrics) {
    navigate("/");
    return null;
  }

  const handleOptionSelect = (type: "quote" | "consultation") => {
    setFormType(type);
    setShowLeadForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Ihre optimale Solaranlage
          </h1>

          {!showLeadForm ? (
            <>
              <ConfigurationSummary metrics={metrics} address={address} />
              <Extras />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleOptionSelect("quote")}
                  className="p-8 h-auto flex flex-col items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <Mail className="h-8 w-8" />
                  <div>
                    <div className="text-lg font-semibold">Angebot erhalten</div>
                    <div className="text-sm opacity-90">
                      Kostenloses Angebot per E-Mail
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => handleOptionSelect("consultation")}
                  className="p-8 h-auto flex flex-col items-center gap-4 bg-gradient-to-r from-green-600 to-teal-600 text-white"
                >
                  <Calendar className="h-8 w-8" />
                  <div>
                    <div className="text-lg font-semibold">Beratungstermin</div>
                    <div className="text-sm opacity-90">
                      Persönliche Beratung vereinbaren
                    </div>
                  </div>
                </Button>
              </div>
            </>
          ) : (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                {formType === "quote"
                  ? "Kostenloses Angebot anfordern"
                  : "Beratungstermin vereinbaren"}
              </h2>
              <LeadForm formType={formType} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};