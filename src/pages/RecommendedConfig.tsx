import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Battery, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ConfigurationSummary } from "@/components/configurator/ConfigurationSummary";
import { Extras } from "@/components/configurator/Extras";
import { LeadForm } from "@/components/LeadForm";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";

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

  const yearlyProduction = metrics.monthlyProduction * 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F75c03]/5 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Ihre optimale Solaranlage
          </h1>

          {!showLeadForm ? (
            <>
              <ConfigurationSummary metrics={metrics} address={address} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Solar Module */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Full Black Module</h2>
                  <div className="aspect-video mb-4">
                    <img 
                      src="/lovable-uploads/fe437c08-df76-4ced-92d4-e82b0a6afe5c.png" 
                      alt="Full Black Solar Module 500W" 
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Leistung: 500W</p>
                    <p className="font-semibold">Anzahl: {metrics.moduleCount} Stück</p>
                    <p className="text-sm text-gray-600">
                      Hocheffiziente Module für maximale Leistung
                    </p>
                  </div>
                </Card>

                {/* Wechselrichter */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Wechselrichter
                  </h2>
                  <div className="aspect-video mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80"
                      alt="Huawei Wechselrichter"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Huawei SUN2000</p>
                    <p className="font-semibold">Leistung: {Math.ceil(metrics.moduleCount * 0.5)}kW</p>
                    <p className="text-sm text-gray-600">
                      Smart-Home ready mit integriertem Energiemanagement
                    </p>
                  </div>
                </Card>

                {/* Batterie */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Battery className="h-5 w-5 text-green-500" />
                    Batteriespeicher
                  </h2>
                  <div className="aspect-video mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80"
                      alt="Huawei LUNA Speicher"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Huawei LUNA 2000</p>
                    <p className="font-semibold">Kapazität: {Math.ceil(yearlyProduction / 365 / 2)}kWh</p>
                    <p className="text-sm text-gray-600">
                      Modularer Speicher für maximale Flexibilität
                    </p>
                  </div>
                </Card>
              </div>

              <div className="mt-8">
                <SavingsCalculator yearlyProduction={yearlyProduction} />
              </div>
              
              <Extras />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleOptionSelect("quote")}
                  className="p-8 h-auto flex flex-col items-center gap-4 bg-gradient-to-r from-[#F75c03] to-[#F75c03]/80 text-white"
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
                  variant="outline"
                  className="p-8 h-auto flex flex-col items-center gap-4 border-[#F75c03] text-[#F75c03] hover:bg-[#F75c03]/10"
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

              <Testimonials />
              <FAQ />
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