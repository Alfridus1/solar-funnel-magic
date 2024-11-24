import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { HeroImage } from "./components/HeroImage";
import { SystemMetrics } from "./components/SystemMetrics";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { PDFDownloadButton } from "./components/PDFDownloadButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/components/configurator/types";
import { ProductGrid } from "./components/ProductGrid";
import { CallToAction } from "./components/CallToAction";
import { RegistrationOverlay } from "./components/registration/RegistrationOverlay";
import { Benefits } from "@/components/Benefits";

export const ProductShowcase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formType, setFormType] = useState<"quote" | "consultation" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const { metrics, address } = location.state || {};

  const { data: products = [] } = useQuery({
    queryKey: ['solar-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solar_products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data.map(product => ({
        ...product,
        category: product.category as 'module' | 'inverter' | 'battery',
        specs: product.specs as Product['specs']
      }));
    }
  });

  const { data: priceSettings } = useQuery({
    queryKey: ['price-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (!metrics) {
      navigate("/");
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, metrics]);

  if (!metrics) {
    return null;
  }

  const estimatedPriceMin = priceSettings ? Math.round(metrics.kWp * priceSettings.price_per_kwp_min) : 0;
  const estimatedPriceMax = priceSettings ? Math.round(metrics.kWp * priceSettings.price_per_kwp_max) : 0;

  const handleQuoteRequest = () => {
    if (!isAuthenticated) {
      setFormType("quote");
      setShowLeadForm(true);
    } else {
      toast({
        title: "Angebot angefordert",
        description: "Wir werden uns in Kürze bei Ihnen melden.",
      });
    }
  };

  const handleConsultationRequest = () => {
    if (!isAuthenticated) {
      setFormType("consultation");
      setShowLeadForm(true);
    } else {
      toast({
        title: "Beratung angefordert",
        description: "Wir werden uns in Kürze bei Ihnen melden.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue-50 to-white">
      <HeroImage />

      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* Analysis Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 bg-white/90 backdrop-blur shadow-lg rounded-2xl">
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Ihre Solar-Analyse</h1>
                <PDFDownloadButton metrics={metrics} address={address} />
              </div>

              <SystemMetrics
                moduleCount={Math.round(metrics.kWp * 2)}
                kWp={metrics.kWp}
                annualProduction={Math.round(metrics.kWp * 950)}
                roofArea={metrics.roofArea}
              />

              <div className="grid grid-cols-2 gap-4 sm:gap-8">
                <SavingsCalculator yearlyProduction={Math.round(metrics.kWp * 950)} />
              </div>
            </div>
          </Card>

          {/* New Price Estimation Card */}
          <Card className="p-8 bg-white/90 backdrop-blur shadow-lg rounded-2xl">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Unser Rundum-Sorglos-Paket</h2>
              
              <div className="space-y-6">
                <p className="text-lg text-gray-700">
                  Ihre Solaranlage mit {metrics.kWp.toFixed(1)} kWp Leistung
                </p>
                <div className="bg-solar-orange/10 p-6 rounded-xl">
                  <p className="text-lg font-semibold mb-2">Geschätzte Investition:</p>
                  <p className="text-3xl font-bold text-solar-orange">
                    {estimatedPriceMin.toLocaleString()}€ - {estimatedPriceMax.toLocaleString()}€
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Komplettpreis inkl. MwSt.
                  </p>
                </div>

                <Benefits />

                <div className="flex gap-4">
                  <button
                    onClick={handleQuoteRequest}
                    className="flex-1 bg-solar-orange text-white px-6 py-3 rounded-lg hover:bg-solar-orange/90 transition-colors"
                  >
                    Angebot anfordern
                  </button>
                  <button
                    onClick={handleConsultationRequest}
                    className="flex-1 border border-solar-orange text-solar-orange px-6 py-3 rounded-lg hover:bg-solar-orange/10 transition-colors"
                  >
                    Beratungstermin
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Products Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Premium Komponenten für Ihre Anlage
          </h2>
          <ProductGrid 
            products={products} 
            onConsultationRequest={handleConsultationRequest}
          />
        </section>

        <CallToAction 
          onQuoteRequest={handleQuoteRequest}
          onConsultationRequest={handleConsultationRequest}
        />

        <div className="max-w-4xl mx-auto space-y-16">
          <Testimonials />
          <FAQ />
        </div>
      </div>

      {!isAuthenticated && (
        <RegistrationOverlay 
          onComplete={() => setIsAuthenticated(true)} 
          metrics={metrics}
          address={address}
        />
      )}
    </div>
  );
};