import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Download, Lock } from "lucide-react";
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
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto mb-8 p-8 bg-white shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Ihr persönlicher Solarenergie-Report</h1>
              <div className="flex items-center gap-2 text-solar-orange">
                <Download className="h-5 w-5" />
                <span className="font-medium">PDF Report</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* Unblurred Section */}
              <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-gradient-to-br from-solar-orange/10 to-solar-orange/5">
                    <h3 className="font-semibold mb-2">Dachfläche</h3>
                    <p className="text-2xl font-bold">{metrics.roofArea}m²</p>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-solar-blue/10 to-solar-blue/5">
                    <h3 className="font-semibold mb-2">Mögliche Module</h3>
                    <p className="text-2xl font-bold">{metrics.possiblePanels} Stück</p>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-green-100 to-green-50">
                    <h3 className="font-semibold mb-2">Anlagengröße</h3>
                    <p className="text-2xl font-bold">{metrics.kWp} kWp</p>
                  </Card>
                </div>

                <ProductShowcase metrics={metrics} />
              </section>

              {/* Blurred Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Lock className="h-12 w-12 text-solar-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Vollständiger Report</h3>
                  <p className="text-gray-600 mb-4 text-center max-w-md">
                    Erhalten Sie Zugang zum vollständigen Report mit detaillierten Analysen und Einsparungsberechnungen
                  </p>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleOptionSelect("quote")}
                      className="bg-solar-orange hover:bg-solar-orange-600"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Report anfordern
                    </Button>
                    <Button
                      onClick={() => handleOptionSelect("consultation")}
                      variant="outline"
                      className="border-solar-orange text-solar-orange hover:bg-solar-orange/10"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Beratungstermin
                    </Button>
                  </div>
                </div>
                
                <div className="filter blur-[2px]">
                  <SavingsCalculator yearlyProduction={metrics.monthlyProduction * 12} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Finanzielle Vorteile</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Jährliche Einsparung</span>
                          <span className="font-semibold">€{metrics.annualSavings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ROI</span>
                          <span className="font-semibold">8-12 Jahre</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Umweltauswirkung</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>CO₂-Einsparung/Jahr</span>
                          <span className="font-semibold">4.2 Tonnen</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Entspricht Bäumen</span>
                          <span className="font-semibold">168 Stück</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="max-w-4xl mx-auto">
            <Testimonials />
            <FAQ />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              {formType === "quote"
                ? "Report kostenlos anfordern"
                : "Beratungstermin vereinbaren"}
            </h2>
            <LeadForm formType={formType} />
          </Card>
        </div>
      )}
    </div>
  );
};