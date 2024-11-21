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