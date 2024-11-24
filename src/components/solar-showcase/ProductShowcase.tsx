import { SystemMetrics } from "./components/SystemMetrics";
import { ShowcaseHeader } from "./components/ShowcaseHeader";
import { HeroImage } from "./components/HeroImage";
import { ShowcaseContent } from "./components/ShowcaseContent";

export const ProductShowcase = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ShowcaseHeader />
      <div className="relative">
        <HeroImage />
        <SystemMetrics 
          moduleCount={24}
          kWp={12}
          annualProduction={11400}
          roofArea={65}
        />
        <ShowcaseContent />
      </div>
    </div>
  );
};
