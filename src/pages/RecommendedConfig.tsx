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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F75c03]/5 to-white">
      {!showLeadForm ? (
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section with Modern House Image */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden mb-12">
            <img 
              src="/lovable-uploads/b078c6ba-faca-4278-af13-f78ce0cdb4cf.png"
              alt="Modernes Solarhaus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8 text-white max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">
                  Ihre maßgeschneiderte Solarlösung
                </h1>
                <p className="text-lg text-white/90">
                  Basierend auf Ihrer Dachfläche haben wir die optimale Konfiguration für Sie berechnet.
                  Entdecken Sie Ihr Solarpotenzial.
                </p>
              </div>
            </div>
          </div>

          <Card className="max-w-4xl mx-auto mb-8 p-8 bg-white shadow-lg">
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
              {/* Key Metrics Section */}
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6 bg-gradient-to-br from-solar-orange/10 to-solar-orange/5">
                  <Sun className="h-6 w-6 text-solar-orange mb-2" />
                  <h3 className="font-semibold mb-1">Dachfläche</h3>
                  <p className="text-2xl font-bold">{metrics.roofArea}m²</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-solar-blue/10 to-solar-blue/5">
                  <Home className="h-6 w-6 text-solar-blue-500 mb-2" />
                  <h3 className="font-semibold mb-1">Module</h3>
                  <p className="text-2xl font-bold">{metrics.possiblePanels} Stück</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-emerald-100 to-emerald-50">
                  <Zap className="h-6 w-6 text-emerald-600 mb-2" />
                  <h3 className="font-semibold mb-1">Anlagengröße</h3>
                  <p className="text-2xl font-bold">{metrics.kWp} kWp</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-100 to-purple-50">
                  <Battery className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-semibold mb-1">Autarkie</h3>
                  <p className="text-2xl font-bold">bis 80%</p>
                </Card>
              </section>

              {/* Product Showcase Section */}
              <ProductShowcase metrics={metrics} />

              {/* Blurred Section */}
              <div className="relative mt-12">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Lock className="h-12 w-12 text-solar-orange mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Vollständiger Report</h3>
                  <p className="text-gray-600 mb-6 text-center max-w-md">
                    Erhalten Sie Zugang zum vollständigen Report mit detaillierten Analysen,
                    Einsparungsberechnungen und Ihrer individuellen Anlagenkonfiguration
                  </p>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleOptionSelect("quote")}
                      className="bg-solar-orange hover:bg-solar-orange-600 text-lg px-6 py-3"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Report anfordern
                    </Button>
                    <Button
                      onClick={() => handleOptionSelect("consultation")}
                      variant="outline"
                      className="border-solar-orange text-solar-orange hover:bg-solar-orange/10 text-lg px-6 py-3"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Beratungstermin
                    </Button>
                  </div>
                </div>
                
                <div className="filter blur-[2px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SavingsCalculator yearlyProduction={metrics.monthlyProduction * 12} />
                    <Card className="p-6">
                      <h3 className="text-xl font-bold mb-4">Umweltauswirkung</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span>CO₂-Einsparung/Jahr</span>
                          <span className="font-bold text-green-700">4.2 Tonnen</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span>Entspricht Bäumen</span>
                          <span className="font-bold text-green-700">168 Stück</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span>Eingesparte Energie</span>
                          <span className="font-bold text-green-700">{metrics.monthlyProduction * 12} kWh/Jahr</span>
                        </div>
                      </div>
                    </Card>
                  </div>
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