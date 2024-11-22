import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { HeroImage } from "@/components/solar-showcase/components/HeroImage";
import { LeadFormOverlay } from "@/components/solar-showcase/components/LeadFormOverlay";
import { SystemMetrics } from "@/components/solar-showcase/components/SystemMetrics";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Shield, Wrench, Clock, Package, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SolarOfferPDF } from "../pdf/SolarOfferPDF";
import { useToast } from "@/components/ui/use-toast";

export const ProductShowcase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formType, setFormType] = useState<"quote" | "consultation" | null>(null);
  const { toast } = useToast();
  
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
      image: "/lovable-uploads/fe437c08-df76-4ced-92d4-e82b0a6afe5c.png",
      features: ["500W Nennleistung", "21% Wirkungsgrad", "30 Jahre Garantie"]
    },
    {
      title: "Smart Wechselrichter",
      description: "Intelligente Steuerung Ihrer Solaranlage",
      image: "/lovable-uploads/f2d1edec-2b0f-4af0-9ec8-9e7caf7a8ea7.png",
      features: ["98.6% Wirkungsgrad", "Integriertes Monitoring", "Smart-Home ready"]
    },
    {
      title: "Hochleistungsspeicher",
      description: "Maximale Unabhängigkeit durch effiziente Speicherung",
      image: "/lovable-uploads/2b67e439-3bd1-4ad6-8498-ee34e8f6d45f.png",
      features: ["15kWh Kapazität", "95% Entladetiefe", "10 Jahre Garantie"]
    },
    {
      title: "Premium Wallbox",
      description: "Intelligente Ladestation für Ihr E-Auto",
      image: "/lovable-uploads/b078c6ba-faca-4278-af13-f78ce0cdb4cf.png",
      features: ["22kW Ladeleistung", "Dynamisches Lastmanagement", "RFID-Zugangskontrolle"]
    },
    {
      title: "Smart Home System",
      description: "Vernetzte Haussteuerung für maximale Effizienz",
      image: "/lovable-uploads/230bf2e3-b64a-4f51-bb2f-f246df2597be.png",
      features: ["Energiemanagement", "App-Steuerung", "KNX-Integration"]
    },
    {
      title: "Wärmepumpe",
      description: "Effiziente Heizlösung für Ihr Zuhause",
      image: "/lovable-uploads/03677377-bf21-4a7d-b8a4-c5f6e9b87885.png",
      features: ["COP bis 5.0", "PV-Optimiert", "Smart Grid Ready"]
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
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Ihre Solar-Analyse</h1>
              <PDFDownloadLink
                document={
                  <SolarOfferPDF
                    metrics={metrics}
                    address={address}
                  />
                }
                fileName="solar-angebot.pdf"
              >
                {({ loading }) => (
                  <Button
                    className="bg-solar-orange hover:bg-solar-orange-dark"
                    disabled={loading}
                  >
                    {loading ? (
                      "Wird geladen..."
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Angebot als PDF
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
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
              <div className="grid md:grid-cols-3 gap-8">
                {premiumProducts.map((product, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-solar-blue-50 to-white p-6">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-contain"
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
                      <Button 
                        className="w-full mt-4 bg-solar-orange hover:bg-solar-orange-dark"
                        onClick={() => {
                          setFormType("consultation");
                          setShowLeadForm(true);
                        }}
                      >
                        Beratung anfragen
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

        <section className="py-16 bg-gradient-to-br from-solar-blue-50 to-white rounded-3xl">
          <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold">
              Bereit für Ihre eigene Solaranlage?
            </h2>
            <p className="text-lg text-gray-600">
              Lassen Sie sich von unseren Experten beraten und erhalten Sie ein 
              maßgeschneidertes Angebot für Ihr Zuhause.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-solar-orange hover:bg-solar-orange-dark"
              >
                Kostenloses Angebot
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-solar-orange text-solar-orange hover:bg-solar-orange/10"
              >
                Beratungstermin vereinbaren
              </Button>
            </div>
          </div>
        </section>
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