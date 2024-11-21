import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Download, Lock, Sun, Home, Battery, Zap } from "lucide-react";
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

  // Calculate annual production based on kWp (950 kWh per kWp annually)
  const annualProduction = Math.round(metrics.kWp * 950);
  const moduleCount = Math.round(metrics.kWp * 2); // Since each module is 0.5 kWp

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F75c03]/5 to-white">
      {!showLeadForm ? (
        <div className="container mx-auto px-4 py-8">
          {/* Full-width module image */}
          <div className="h-[300px] w-full rounded-3xl overflow-hidden mb-12">
            <img 
              src="/lovable-uploads/fe437c08-df76-4ced-92d4-e82b0a6afe5c.png"
              alt="500W Full Black Module"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <Card className="max-w-4xl mx-auto mb-8 p-8 bg-white/90 backdrop-blur shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Ihr persönlicher Solarenergie-Report
              </h2>
              <div className="flex items-center gap-2 text-solar-orange cursor-pointer hover:text-solar-orange-dark transition-colors">
                <Download className="h-5 w-5" />
                <span className="font-medium">PDF Report</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* Modern Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <Sun className="h-5 w-5" />
                    <span className="text-sm font-medium">Dachfläche</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.roofArea}m²</p>
                  <p className="text-sm text-gray-600">Nutzbare Fläche</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Home className="h-5 w-5" />
                    <span className="text-sm font-medium">Module</span>
                  </div>
                  <p className="text-2xl font-bold">{moduleCount} Stück</p>
                  <p className="text-sm text-gray-600">500W Full Black</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <Zap className="h-5 w-5" />
                    <span className="text-sm font-medium">Anlagengröße</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.kWp} kWp</p>
                  <p className="text-sm text-gray-600">Gesamtleistung</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <Battery className="h-5 w-5" />
                    <span className="text-sm font-medium">Jahresertrag</span>
                  </div>
                  <p className="text-2xl font-bold">{annualProduction} kWh</p>
                  <p className="text-sm text-gray-600">pro Jahr</p>
                </div>
              </div>

              {/* Product Showcase Section */}
              <ProductShowcase metrics={{
                ...metrics,
                monthlyProduction: Math.round(annualProduction / 12)
              }} />

              {/* Updated Environmental Impact Section */}
              <div className="filter blur-[2px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SavingsCalculator yearlyProduction={annualProduction} />
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Umweltauswirkung</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span>CO₂-Einsparung/Jahr</span>
                        <span className="font-bold text-green-700">{Math.round(annualProduction * 0.4)} kg</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span>Entspricht Bäumen</span>
                        <span className="font-bold text-green-700">{Math.round(annualProduction * 0.4 / 25)} Stück</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span>Eingesparte Energie</span>
                        <span className="font-bold text-green-700">{annualProduction} kWh/Jahr</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>

          {/* Social Proof Section */}
          <div className="max-w-4xl mx-auto">
            <Testimonials />
            <FAQ />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {formType === "quote"
                ? "Ihren persönlichen Solar-Report kostenlos anfordern"
                : "Beratungstermin vereinbaren"}
            </h2>
            <LeadForm formType={formType} />
          </Card>
        </div>
      )}
    </div>
  );
};
