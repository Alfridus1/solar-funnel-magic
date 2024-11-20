import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SolarMetrics } from "./components/SolarMetrics";
import { SystemVisualizer } from "./components/SystemVisualizer";
import { ProductFeatures } from "./components/ProductFeatures";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ShowcaseMetrics {
  monthlyProduction: number;
  annualSavings: number;
  roofArea: number;
  possiblePanels: number;
  kWp: number;
}

interface ProductShowcaseProps {
  metrics: ShowcaseMetrics;
}

export const ProductShowcase = ({ metrics }: ProductShowcaseProps) => {
  const [activeFeature, setActiveFeature] = useState<string>("solar");
  const yearlyProduction = metrics.monthlyProduction * 12;

  const products = [
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Container className="py-12 space-y-16 animate-fade-in">
        <SolarMetrics 
          kWp={metrics.kWp}
          yearlyProduction={yearlyProduction}
          annualSavings={metrics.annualSavings}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SystemVisualizer activeFeature={activeFeature} />
            <ProductFeatures 
              activeFeature={activeFeature} 
              onFeatureSelect={setActiveFeature} 
            />
          </div>
          
          <div className="space-y-8">
            <SavingsCalculator yearlyProduction={yearlyProduction} />
          </div>
        </div>

        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Unsere Premium Produkte
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => (
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
                  >
                    Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
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
      </Container>
    </div>
  );
};