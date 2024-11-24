import { SystemMetrics } from "./components/SystemMetrics";
import { ShowcaseHeader } from "./components/ShowcaseHeader";
import { HeroImage } from "./components/HeroImage";
import { ShowcaseContent } from "./components/ShowcaseContent";

export const ProductShowcase = () => {
  // Default values for the showcase
  const defaultMetrics = {
    moduleCount: 24,
    kWp: 12,
    annualProduction: 11400,
    roofArea: 65,
  };

  const mockPriceSettings = {
    price_per_kwp_min: 1500,
    price_per_kwp_max: 2000,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ShowcaseHeader />
      <div className="relative">
        <HeroImage />
        <SystemMetrics 
          moduleCount={defaultMetrics.moduleCount}
          kWp={defaultMetrics.kWp}
          annualProduction={defaultMetrics.annualProduction}
          roofArea={defaultMetrics.roofArea}
        />
        <ShowcaseContent 
          metrics={defaultMetrics}
          address="Sample Address"
          products={[]}
          priceSettings={mockPriceSettings}
          onQuoteRequest={() => {}}
          onConsultationRequest={() => {}}
          isAuthenticated={false}
        />
      </div>
    </div>
  );
};