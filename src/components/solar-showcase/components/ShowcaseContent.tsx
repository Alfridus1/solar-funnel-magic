import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/components/configurator/types";

export const ShowcaseContent = () => {
  const [activeFeature, setActiveFeature] = useState("solar");
  const { toast } = useToast();

  // Fetch solar products
  const { data: products } = useQuery({
    queryKey: ['solar-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solar_products')
        .select('*');
      
      if (error) throw error;
      
      // Convert and validate the data to match Product type
      return (data || []).map(item => {
        // Ensure category is one of the allowed values
        const category = ['module', 'inverter', 'battery'].includes(item.category) 
          ? (item.category as "module" | "inverter" | "battery")
          : "module"; // Default to module if invalid category

        return {
          id: item.id,
          name: item.name,
          category,
          price: item.price,
          specs: item.specs,
          image_url: item.image_url,
          datasheet_url: item.datasheet_url,
          created_at: item.created_at,
          updated_at: item.updated_at
        } as Product;
      });
    }
  });

  // Example metrics (you should replace these with actual data from your application)
  const metrics = {
    kWp: 10.5,
    yearlyProduction: 9500,
    annualProduction: 9500,
    annualSavings: 3800,
    moduleCount: 21,
    roofArea: 60,
    monthlySavings: 317,
    yearlySavings: 3800,
    roiYears: 8,
    initialYearlySavings: 3800,
    estimatedPrice: 19500
  };

  const handleConsultationRequest = () => {
    toast({
      title: "Beratungsanfrage",
      description: "Vielen Dank für Ihre Anfrage. Wir melden uns in Kürze bei Ihnen.",
    });
  };

  const handleQuoteRequest = () => {
    toast({
      title: "Angebotsanfrage",
      description: "Vielen Dank für Ihre Anfrage. Wir erstellen Ihnen ein individuelles Angebot.",
    });
  };

  const handleShowQuoteForm = () => {
    // Implement quote form logic
  };

  const handleShowConsultationForm = () => {
    // Implement consultation form logic
  };

  return (
    <div className="space-y-8">
      <HeroImage />
      <MetricsHeader 
        kWp={metrics.kWp}
        yearlyProduction={metrics.yearlyProduction}
        annualSavings={metrics.annualSavings}
      />
      <ProductOverview />
      <SystemMetrics 
        moduleCount={metrics.moduleCount}
        kWp={metrics.kWp}
        annualProduction={metrics.annualProduction}
        roofArea={metrics.roofArea}
      />
      <SavingsMetrics 
        monthlySavings={metrics.monthlySavings}
        yearlySavings={metrics.yearlySavings}
        roiYears={metrics.roiYears}
        initialYearlySavings={metrics.initialYearlySavings}
      />
      <ProductGrid 
        products={products || []}
        onConsultationRequest={handleConsultationRequest}
      />
      <ProductDetails activeFeature={activeFeature} />
      <ProductFeatures 
        activeFeature={activeFeature}
        onFeatureSelect={setActiveFeature}
      />
      <SystemVisualizer activeFeature={activeFeature} />
      <PricingOptions 
        estimatedPrice={metrics.estimatedPrice}
        onShowQuoteForm={handleShowQuoteForm}
        onShowConsultationForm={handleShowConsultationForm}
      />
      <PremiumProductsSection onConsultationRequest={handleConsultationRequest} />
      <ClimateEffects annualProduction={metrics.annualProduction} />
      <FeatureNavigation 
        activeFeature={activeFeature}
        onFeatureSelect={setActiveFeature}
      />
      <CallToAction 
        onQuoteRequest={handleQuoteRequest}
        onConsultationRequest={handleConsultationRequest}
      />
    </div>
  );
};