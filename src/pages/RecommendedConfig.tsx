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

  const premiumProducts = [
    {
      title: "Premium Solarmodule",
      description: "Hocheffiziente Module mit 30 Jahren Garantie",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
      features: ["500W Nennleistung", "21% Wirkungsgrad", "30 Jahre Garantie"]
    },
    {
      title: "Smart Wechselrichter",
      description: "Intelligente Steuerung Ihrer Solaranlage",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837",
      features: ["98.6% Wirkungsgrad", "Integriertes Monitoring", "Smart-Home ready"]
    },
    {
      title: "Hochleistungsspeicher",
      description: "Maximale Unabhängigkeit durch effiziente Speicherung",
      image: "https://images.unsplash.com/photo-1620677368158-41a63899f5ca",
      features: ["15kWh Kapazität", "95% Entladetiefe", "10 Jahre Garantie"]
    }
  ];

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
            </div>

            <section className="py-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                Unsere Premium Produkte für Sie
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {premiumProducts.map((product, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-solar-blue-50 to-white">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">{product.title}</h3>
                      <p className="text-gray-600">{product.description}</p>
                      <ul className="space-y-2">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-solar-orange" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

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
                  <p className="text-3xl font-bold text-solar-orange mb-4">{estimatedPrice.toLocaleString()}€</p>
                  <p className="text-sm text-gray-500">Komplett-Installation inkl. MwSt.</p>
                </div>
              </div>
            </Card>
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