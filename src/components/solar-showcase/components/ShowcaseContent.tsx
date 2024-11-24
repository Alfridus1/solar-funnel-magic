import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "./ProductGrid";
import { PremiumProductsSection } from "./PremiumProductsSection";
import { MetricsHeader } from "./MetricsHeader";
import { SystemVisualizer } from "./SystemVisualizer";
import { PricingOptions } from "./PricingOptions";
import { ClimateEffects } from "./ClimateEffects";
import { CallToAction } from "./CallToAction";

interface ShowcaseContentProps {
  metrics: any;
  address: string;
  products: any[];
  priceSettings: any;
  isAuthenticated: boolean;
  onQuoteRequest: () => void;
  onConsultationRequest: () => void;
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
    <div className={`space-y-8 ${!isAuthenticated ? 'blur-md' : ''}`}>
      <MetricsHeader metrics={metrics} address={address} />
      <SystemVisualizer activeFeature="solar" />
      <ProductGrid products={products} onConsultationRequest={onConsultationRequest} />
      <PremiumProductsSection onConsultationRequest={onConsultationRequest} />
      <PricingOptions 
        metrics={metrics} 
        onShowQuoteForm={onQuoteRequest} 
        onShowConsultationForm={onConsultationRequest}
        priceSettings={priceSettings}
      />
      <ClimateEffects metrics={metrics} />
      <CallToAction onQuoteRequest={onQuoteRequest} onConsultationRequest={onConsultationRequest} />
    </div>
  );
};