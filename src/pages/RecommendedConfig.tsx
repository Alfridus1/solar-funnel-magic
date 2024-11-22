import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { HeroImage } from "@/components/solar-showcase/components/HeroImage";
import { LeadFormOverlay } from "@/components/solar-showcase/components/LeadFormOverlay";
import { SystemMetrics } from "@/components/solar-showcase/components/SystemMetrics";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { PricingOptions } from "@/components/solar-showcase/components/PricingOptions";
import { PremiumProductsCarousel } from "@/components/solar-showcase/components/PremiumProductsCarousel";

export const RecommendedConfig = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formType, setFormType] = useState<"quote" | "consultation" | null>(null);
  
  const { metrics, address } = location.state || {};

  if (!metrics) {
    navigate("/");
    return null;
  }

  const moduleCount = Math.round(metrics.kWp * 2);
  const annualProduction = Math.round(metrics.kWp * 950);
  const estimatedPrice = Math.round(metrics.kWp * 1950);

  const handleQuoteRequest = () => {
    setFormType("quote");
    setShowLeadForm(true);
  };

  const handleConsultationRequest = () => {
    setFormType("consultation");
    setShowLeadForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue-50 to-white">
      <div className="relative">
        <HeroImage />
        {showLeadForm && (
          <LeadFormOverlay formType={formType} />
        )}
      </div>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-7xl mx-auto mb-12 p-8 bg-white/95 backdrop-blur shadow-lg rounded-xl">
          <div className="mb-8 -mx-8 -mt-8 p-8 bg-gradient-to-br from-solar-orange/5 to-white rounded-t-xl">
            <SystemMetrics
              moduleCount={moduleCount}
              kWp={metrics.kWp}
              annualProduction={annualProduction}
              roofArea={metrics.roofArea}
            />
          </div>

          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Potentialanalyse</h3>
                <div className="group bg-gradient-to-br from-white via-solar-blue-50/50 to-solar-blue-100/30 rounded-xl p-8 shadow-xl backdrop-blur-sm border border-white/50 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-solar-orange/10 via-solar-blue-100/20 to-white/30 opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                  <div className="relative z-10 backdrop-blur-[2px]">
                    <SavingsCalculator yearlyProduction={annualProduction} />
                  </div>
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-solar-orange/10 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-solar-blue/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Unverbindliche Preisschätzung</h3>
                <PricingOptions
                  estimatedPrice={estimatedPrice}
                  onQuoteRequest={handleQuoteRequest}
                  onConsultationRequest={handleConsultationRequest}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="max-w-7xl mx-auto mb-16 overflow-hidden">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-solar-orange to-solar-orange-dark bg-clip-text text-transparent">
              Unsere Premium Komponenten
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Entdecken Sie unsere sorgfältig ausgewählten Premium-Produkte für Ihre Solaranlage
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />
            <PremiumProductsCarousel />
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          <Testimonials />
          <FAQ />
        </div>
      </div>
    </div>
  );
};