import { ProductGrid } from "./ProductGrid";
import { PricingOptions } from "./PricingOptions";
import { SolarMetrics } from "./SolarMetrics";
import { SystemVisualizer } from "./SystemVisualizer";
import { PremiumProductsSection } from "./PremiumProductsSection";
import { ClimateEffects } from "./ClimateEffects";
import { CallToAction } from "./CallToAction";

interface ShowcaseContentProps {
  metrics: any;
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
  onQuoteRequest,
  onConsultationRequest
}: ShowcaseContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <SolarMetrics metrics={metrics} address={address} />
      <SystemVisualizer metrics={metrics} />
      <ProductGrid products={products} />
      <PricingOptions metrics={metrics} priceSettings={priceSettings} />
      <PremiumProductsSection />
      <ClimateEffects metrics={metrics} />
      <CallToAction 
        isAuthenticated={isAuthenticated} 
        onQuoteRequest={onQuoteRequest}
        onConsultationRequest={onConsultationRequest}
      />
    </div>
  );
};