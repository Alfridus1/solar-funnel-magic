import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { HeroImage } from "@/components/solar-showcase/components/HeroImage";
import { LeadFormOverlay } from "@/components/solar-showcase/components/LeadFormOverlay";
import { SystemMetrics } from "@/components/solar-showcase/components/SystemMetrics";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Shield, Wrench, Clock, Package, Leaf, CloudSun } from "lucide-react";
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
  const co2Savings = Math.round(annualProduction * 0.366); // kg CO2 per kWh

  const premiumProducts = [
    {
      title: "Premium Solarmodule",
      description: "Hocheffiziente Module mit 30 Jahren Garantie",
      image: "/lovable-uploads/fe437c08-df76-4ced-92d4-e82b0a6afe5c.png",
      features: ["500W Nennleistung", "21% Wirkungsgrad", "30 Jahre Garantie"],
      climate: "Spart bis zu 12 Tonnen CO₂ pro Jahr"
    },
    {
      title: "Smart Wechselrichter",
      description: "Intelligente Steuerung Ihrer Solaranlage",
      image: "/lovable-uploads/f2d1edec-2b0f-4af0-9ec8-9e7caf7a8ea7.png",
      features: ["98.6% Wirkungsgrad", "Integriertes Monitoring", "Smart-Home ready"],
      climate: "Optimiert die Energieeffizienz um bis zu 15%"
    },
    {
      title: "Hochleistungsspeicher",
      description: "Maximale Unabhängigkeit durch effiziente Speicherung",
      image: "/lovable-uploads/2b67e439-3bd1-4ad6-8498-ee34e8f6d45f.png",
      features: ["15kWh Kapazität", "95% Entladetiefe", "10 Jahre Garantie"],
      climate: "Erhöht den Eigenverbrauch auf bis zu 80%"
    },
    {
      title: "Smart Wallbox",
      description: "Intelligente Ladestation für Ihr E-Auto",
      image: "/lovable-uploads/b078c6ba-faca-4278-af13-f78ce0cdb4cf.png",
      features: ["22kW Ladeleistung", "Dynamisches Lastmanagement", "RFID-Zugangskontrolle"],
      climate: "Ermöglicht CO₂-neutrales Fahren"
    },
    {
      title: "Smart Home System",
      description: "Vernetzte Haussteuerung für maximale Effizienz",
      image: "/lovable-uploads/230bf2e3-b64a-4f51-bb2f-f246df2597be.png",
      features: ["Energiemanagement", "App-Steuerung", "KNX-Integration"],
      climate: "Reduziert den Energieverbrauch um bis zu 30%"
    },
    {
      title: "Wärmepumpe",
      description: "Effiziente Heizlösung für Ihr Zuhause",
      image: "/lovable-uploads/03677377-bf21-4a7d-b8a4-c5f6e9b87885.png",
      features: ["COP bis 5.0", "PV-Optimiert", "Smart Grid Ready"],
      climate: "Bis zu 75% weniger CO₂-Ausstoß beim Heizen"
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
        <Card className="max-w-5xl mx-auto mb-8 p-8 bg-white/90 backdrop-blur shadow-lg">
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Ihr Beitrag zum Klimaschutz</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Leaf className="h-8 w-8 text-green-500" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-green-600">{co2Savings.toLocaleString()} kg</p>
                    <p className="text-sm text-gray-600">CO₂-Einsparung pro Jahr</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <CloudSun className="h-8 w-8 text-blue-500" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-blue-600">{annualProduction.toLocaleString()} kWh</p>
                    <p className="text-sm text-gray-600">Sauberer Solarstrom pro Jahr</p>
                  </div>
                </div>
              </div>
            </div>

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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {premiumProducts.map((product, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gradient-to-br from-solar-blue-50 to-white p-8">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-contain hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">{product.title}</h3>
                      <p className="text-gray-600">{product.description}</p>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-green-700 flex items-center gap-2">
                          <Leaf className="h-4 w-4" />
                          {product.climate}
                        </p>
                      </div>
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