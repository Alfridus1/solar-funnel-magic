import { useState } from "react";
import { MetricsHeader } from "./components/MetricsHeader";
import { HouseVisualization } from "./components/HouseVisualization";
import { FeatureNavigation } from "./components/FeatureNavigation";
import { ProductDetails } from "./components/ProductDetails";

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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-8">
        <h1 className="text-5xl font-bold text-center mb-12">Ihre Solaranlage</h1>
        
        <MetricsHeader 
          kWp={metrics.kWp}
          yearlyProduction={yearlyProduction}
          annualSavings={metrics.annualSavings}
        />

        <HouseVisualization activeFeature={activeFeature} />
        
        <FeatureNavigation 
          activeFeature={activeFeature}
          onFeatureSelect={setActiveFeature}
        />

        <ProductDetails activeFeature={activeFeature} />

        <div className="text-center mb-16">
          <button className="bg-solar-orange hover:bg-solar-orange/90 text-white px-8 py-6 text-lg rounded-md">
            Jetzt konfigurieren
          </button>
        </div>
      </div>
    </div>
  );
};