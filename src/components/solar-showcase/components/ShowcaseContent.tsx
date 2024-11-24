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
  const navigate = useNavigate();

  return (
    <div className={`space-y-8 ${!isAuthenticated ? 'blur-md' : ''}`}>
      <MetricsHeader metrics={metrics} address={address} />
      <SystemVisualizer metrics={metrics} />
      <ProductGrid products={products} onConsultationRequest={onConsultationRequest} />
      <PremiumProductsSection onConsultationRequest={onConsultationRequest} />
      <PricingOptions priceSettings={priceSettings} metrics={metrics} />
      <ClimateEffects metrics={metrics} />
      <CallToAction onQuoteRequest={onQuoteRequest} onConsultationRequest={onConsultationRequest} />
    </div>
  );
};