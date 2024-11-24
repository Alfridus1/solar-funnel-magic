import { Card } from "@/components/ui/card";
import { SystemMetrics } from "./SystemMetrics";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { SavingsMetrics } from "./SavingsMetrics";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Benefits } from "@/components/Benefits";
import { PremiumProductsSection } from "./PremiumProductsSection";
import { CallToAction } from "./CallToAction";

interface ShowcaseContentProps {
  metrics: any;
  address: string;
  products: any[];
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
  isAuthenticated
}: ShowcaseContentProps) => {
  const estimatedPriceMin = priceSettings ? Math.round(metrics.kWp * priceSettings.price_per_kwp_min) : 0;
  const estimatedPriceMax = priceSettings ? Math.round(metrics.kWp * priceSettings.price_per_kwp_max) : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 lg:space-y-16">
      <SystemMetrics
        moduleCount={Math.round(metrics.kWp * 2)}
        kWp={metrics.kWp}
        annualProduction={Math.round(metrics.kWp * 950)}
        roofArea={metrics.roofArea}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="p-4 md:p-6 lg:p-8 bg-white/90 backdrop-blur shadow-lg rounded-2xl h-full">
          <SavingsCalculator yearlyProduction={Math.round(metrics.kWp * 950)} />
        </div>

        <div className="p-4 md:p-6 lg:p-8 bg-white/90 backdrop-blur shadow-lg rounded-2xl h-full">
          <div className="space-y-6 lg:space-y-8">
            <div className="bg-solar-orange/10 p-4 md:p-6 rounded-xl">
              <p className="text-lg font-semibold mb-2">Geschätzte Investition:</p>
              <p className="text-2xl md:text-3xl font-bold text-solar-orange">
                {estimatedPriceMin.toLocaleString()}€ - {estimatedPriceMax.toLocaleString()}€
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Komplettpreis inkl. MwSt.
              </p>
            </div>

            <Benefits />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onQuoteRequest}
                className="flex-1 bg-solar-orange text-white px-6 py-3 rounded-lg hover:bg-solar-orange/90 transition-colors text-base md:text-lg"
              >
                Angebot anfordern
              </button>
              <button
                onClick={onConsultationRequest}
                className="flex-1 border border-solar-orange text-solar-orange px-6 py-3 rounded-lg hover:bg-solar-orange/10 transition-colors text-base md:text-lg"
              >
                Beratungstermin
              </button>
            </div>
          </div>
        </div>
      </div>

      <PremiumProductsSection onConsultationRequest={onConsultationRequest} />

      <CallToAction 
        onQuoteRequest={onQuoteRequest}
        onConsultationRequest={onConsultationRequest}
      />

      <div className="max-w-4xl mx-auto space-y-8 lg:space-y-16">
        <Testimonials />
        <FAQ />
      </div>
    </div>
  );
};