import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { HeroImage } from "@/components/solar-showcase/components/HeroImage";
import { LeadFormOverlay } from "@/components/solar-showcase/components/LeadFormOverlay";
import { ProductOverview } from "@/components/solar-showcase/components/ProductOverview";
import { SystemMetrics } from "@/components/solar-showcase/components/SystemMetrics";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Shield, Wrench, Clock, Package } from "lucide-react";

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

  // Calculate values based on 500W modules
  const moduleCount = Math.round(metrics.kWp * 2); // Since each module is 0.5 kWp
  const annualProduction = Math.round(metrics.kWp * 950); // 950 kWh per kWp annually
  const estimatedPrice = Math.round(metrics.kWp * 1950);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F75c03]/5 to-white">
      <div className="relative">
        <HeroImage />
        {showLeadForm && (
          <LeadFormOverlay formType={formType} />
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto mb-8 p-8 bg-white/90 backdrop-blur shadow-lg">
          <div className="space-y-8">
            <SystemMetrics
              moduleCount={moduleCount}
              kWp={metrics.kWp}
              annualProduction={annualProduction}
              roofArea={metrics.roofArea}
            />

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

            <Card className="p-6 bg-gradient-to-br from-solar-orange/10 to-white">
              <h3 className="text-2xl font-bold mb-6">Ihr All-Inclusive Angebot</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
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
                </div>
                <div className="flex flex-col justify-center p-6 bg-white rounded-lg shadow-lg">
                  <p className="text-gray-600 mb-2">Unverbindliche Preisschätzung</p>
                  <p className="text-3xl font-bold text-solar-orange mb-4">{estimatedPrice.toLocaleString()}€</p>
                  <p className="text-sm text-gray-500">Komplett-Installation inkl. MwSt.</p>
                </div>
              </div>
            </Card>
          </div>
        </Card>

        <div className="max-w-4xl mx-auto">
          <ProductOverview />
          <Testimonials />
          <FAQ />
        </div>
      </div>
    </div>
  );
};