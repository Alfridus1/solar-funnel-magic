import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProductShowcase } from "@/components/solar-showcase/ProductShowcase";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F75c03]/5 to-white">
      {!showLeadForm ? (
        <>
          <ProductShowcase metrics={metrics} />
          
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <SavingsCalculator yearlyProduction={metrics.monthlyProduction * 12} />
              
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
            </div>
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              {formType === "quote"
                ? "Kostenloses Angebot anfordern"
                : "Beratungstermin vereinbaren"}
            </h2>
            <LeadForm formType={formType} />
          </Card>
        </div>
      )}
    </div>
  );
};