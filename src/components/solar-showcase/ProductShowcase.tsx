import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SolarMetrics } from "./components/SolarMetrics";
import { SystemVisualizer } from "./components/SystemVisualizer";
import { ProductFeatures } from "./components/ProductFeatures";
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
      </Container>
    </div>
  );
};