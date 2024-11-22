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
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Ihr Beitrag zum Klimaschutz</h2>
              <ClimateEffects annualProduction={annualProduction} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Potentialanalyse</h3>
                <div className="bg-gradient-to-br from-white via-solar-blue-50/50 to-solar-blue-100/30 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-white/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-solar-orange/5 via-solar-blue-50/10 to-white/20 pointer-events-none" />
                  <div className="relative z-10">
                    <SavingsCalculator yearlyProduction={annualProduction} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Unverbindliche Preisschätzung</h3>
                <Card className="p-6 bg-gradient-to-br from-solar-orange/10 to-white">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Shield className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Premium Komponenten</h4>
                        <p className="text-gray-600">Hochwertige Module, Wechselrichter und ein 10 kWh Speicher für maximale Unabhängigkeit</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Wrench className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Komplette Installation</h4>
                        <p className="text-gray-600">Professionelle DC und AC Installation inklusive neuem Zählerschrank nach aktuellen Standards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Schnelle Umsetzung</h4>
                        <p className="text-gray-600">Von der Planung bis zur Inbetriebnahme - alles aus einer Hand</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Package className="h-6 w-6 text-solar-orange flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Rundum-Sorglos-Paket</h4>
                        <p className="text-gray-600">Inklusive aller Genehmigungen, Anmeldungen und Dokumentation</p>
                      </div>
                    </div>
                    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
                      <p className="text-4xl font-bold text-solar-orange mb-2">{estimatedPrice.toLocaleString()}€</p>
                      <p className="text-sm text-gray-500 mb-4">Komplett-Installation inkl. MwSt.</p>
                      <Button 
                        className="w-full bg-solar-orange hover:bg-solar-orange-dark text-lg py-6"
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