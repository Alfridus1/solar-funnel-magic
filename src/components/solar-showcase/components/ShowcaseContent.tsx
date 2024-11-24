import { HeroImage } from "./HeroImage";
import { MetricsHeader } from "./MetricsHeader";
import { SystemVisualizer } from "./SystemVisualizer";
import { PremiumProductsSection } from "./PremiumProductsSection";
import { CallToAction } from "./CallToAction";
import { Product } from "@/components/configurator/types";

interface ShowcaseContentProps {
  metrics: any;
  address?: string;
  products: Product[];
  priceSettings: any;
  onQuoteRequest: () => void;
  onConsultationRequest: () => void;
  isAuthenticated: boolean;
}

export const ShowcaseContent = ({
  metrics,
  address,
  products,
  priceSettings,
  onQuoteRequest,
  onConsultationRequest,
  isAuthenticated,
}: ShowcaseContentProps) => {
  return (
    <div className="w-full space-y-8 md:space-y-12">
      <HeroImage metrics={metrics} address={address} />
      <div className="px-4 md:px-8 space-y-8 md:space-y-12">
        <MetricsHeader metrics={metrics} />
        <SystemVisualizer />
        <PremiumProductsSection />
        <CallToAction
          onQuoteRequest={onQuoteRequest}
          onConsultationRequest={onConsultationRequest}
        />
      </div>
    </div>
  );
};