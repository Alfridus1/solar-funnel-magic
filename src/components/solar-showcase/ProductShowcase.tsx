import { useState } from "react";
import { MetricsHeader } from "./components/MetricsHeader";
import { HouseVisualization } from "./components/HouseVisualization";
import { FeatureNavigation } from "./components/FeatureNavigation";
import { ProductDetails } from "./components/ProductDetails";
import { SavingsCalculator } from "@/components/SavingsCalculator";

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
    <div className="min-h-screen bg-gradient-to-br from-solar-blue/5 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-12 animate-fade-up">
            Ihre Solaranlage
          </h1>
          
          <MetricsHeader 
            kWp={metrics.kWp}
            yearlyProduction={yearlyProduction}
            annualSavings={metrics.annualSavings}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <HouseVisualization activeFeature={activeFeature} />
            </div>
            <div>
              <SavingsCalculator yearlyProduction={yearlyProduction} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
            <FeatureNavigation 
              activeFeature={activeFeature}
              onFeatureSelect={setActiveFeature}
            />
            <div className="lg:col-span-3">
              <ProductDetails activeFeature={activeFeature} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};