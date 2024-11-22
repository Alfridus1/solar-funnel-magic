import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { HeroImage } from "@/components/solar-showcase/components/HeroImage";
import { LeadFormOverlay } from "@/components/solar-showcase/components/LeadFormOverlay";
import { SystemMetrics } from "@/components/solar-showcase/components/SystemMetrics";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Shield, Wrench, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClimateEffects } from "@/components/solar-showcase/components/ClimateEffects";
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
  const co2Savings = Math.round(annualProduction * 0.366); // kg CO2 per kWh

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F75c03]/5 to-white">
      <div className="relative">
        <HeroImage />
        {showLeadForm && (
          <LeadFormOverlay formType={formType} />
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-5xl mx-auto mb-8 p-8 bg-white/90 backdrop-blur shadow-lg">
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Ihr Beitrag zum Klimaschutz</h2>
              <ClimateEffects co2Savings={co2Savings} annualProduction={annualProduction} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Potential Analysis */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Potentialanalyse</h3>
                <SystemMetrics
                  moduleCount={moduleCount}
                  kWp={metrics.kWp}
                  annualProduction={annualProduction}
                  roofArea={metrics.roofArea}
                />
                <SavingsCalculator yearlyProduction={annualProduction} />
              </div>

              {/* Right Column - Price Estimation */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Unverbindliche Preisschätzung</h3>
                <Card className="p-6 bg-gradient-to-br from-solar-orange/10 to-white">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold">Premium Komponenten</h4>
                        <p className="text-gray-600">Hochwertige Module, Wechselrichter und ein 10 kWh Speicher für maximale Unabhängigkeit</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Wrench className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold">Komplette Installation</h4>
                        <p className="text-gray-600">Professionelle DC und AC Installation inklusive neuem Zählerschrank nach aktuellen Standards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold">Schnelle Umsetzung</h4>
                        <p className="text-gray-600">Von der Planung bis zur Inbetriebnahme - alles aus einer Hand</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold">Rundum-Sorglos-Paket</h4>
                        <p className="text-gray-600">Inklusive aller Genehmigungen, Anmeldungen und Dokumentation</p>
                      </div>
                    </div>
                    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
                      <p className="text-3xl font-bold text-solar-orange mb-2">{estimatedPrice.toLocaleString()}€</p>
                      <p className="text-sm text-gray-500">Komplett-Installation inkl. MwSt.</p>
                      <Button 
                        className="w-full mt-4 bg-solar-orange hover:bg-solar-orange/90"
                        onClick={() => {
                          setFormType("quote");
                          setShowLeadForm(true);
                        }}
                      >
                        Vor-Ort Termin vereinbaren
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>

        <div className="max-w-4xl mx-auto">
          <Testimonials />
          <FAQ />
        </div>
      </div>
    </div>
  );
};