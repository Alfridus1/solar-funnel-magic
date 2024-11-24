import { ProductOverview } from "./ProductOverview";
import { PremiumProductsSection } from "./PremiumProductsSection";
import { CallToAction } from "./CallToAction";
import { ClimateEffects } from "./ClimateEffects";
import { FeatureNavigation } from "./FeatureNavigation";
import { HeroImage } from "./HeroImage";
import { MetricsHeader } from "./MetricsHeader";
import { PricingOptions } from "./PricingOptions";
import { ProductDetails } from "./ProductDetails";
import { ProductFeatures } from "./ProductFeatures";
import { ProductGrid } from "./ProductGrid";
import { SavingsMetrics } from "./SavingsMetrics";
import { SystemMetrics } from "./SystemMetrics";
import { SystemVisualizer } from "./SystemVisualizer";

export const ShowcaseContent = () => {
  return (
    <div className="space-y-8">
      <HeroImage />
      <MetricsHeader />
      <ProductOverview />
      <SystemMetrics />
      <SavingsMetrics />
      <ProductGrid />
      <ProductDetails />
      <ProductFeatures />
      <SystemVisualizer />
      <PricingOptions />
      <PremiumProductsSection />
      <ClimateEffects />
      <FeatureNavigation />
      <CallToAction />
    </div>
  );
};