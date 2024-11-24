import { ProductGrid } from "./ProductGrid";
import { PricingOptions } from "./PricingOptions";
import { SolarMetrics } from "./SolarMetrics";
import { SystemVisualizer } from "./SystemVisualizer";
import { PremiumProductsSection } from "./PremiumProductsSection";
import { ClimateEffects } from "./ClimateEffects";
import { CallToAction } from "./CallToAction";

interface ShowcaseContentProps {
  metrics: {
    kWp: number;
    yearlyProduction: number;
    annualSavings: number;
    roofArea: number;
    annualProduction: number;
    monthlySavings: number;
    yearlySavings: number;
    roiYears: number;
    initialYearlySavings: number;
  };
  address: string;
  products: any[];
  priceSettings: any;
  isAuthenticated: boolean;
  onQuoteRequest?: () => void;
  onConsultationRequest?: () => void;
}

export const ShowcaseContent = ({
  metrics,
  address,
  products,
  priceSettings,
  isAuthenticated,
  onQuoteRequest = () => {},
  onConsultationRequest = () => {},
}: ShowcaseContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <SolarMetrics 
        kWp={metrics.kWp}
        yearlyProduction={metrics.yearlyProduction}
        annualSavings={metrics.annualSavings}
      />
      <SystemVisualizer activeFeature="solar" />
      <ProductGrid 
        products={products} 
        onConsultationRequest={onConsultationRequest}
      />
      <PricingOptions 
        estimatedPrice={priceSettings?.price_per_kwp_min * metrics.kWp || 0}
        onShowQuoteForm={onQuoteRequest}
        onShowConsultationForm={onConsultationRequest}
      />
      <PremiumProductsSection onConsultationRequest={onConsultationRequest} />
      <ClimateEffects annualProduction={metrics.annualProduction} />
      <CallToAction 
        onQuoteRequest={onQuoteRequest}
        onConsultationRequest={onConsultationRequest}
      />
    </div>
  );
};