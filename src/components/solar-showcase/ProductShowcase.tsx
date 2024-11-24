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

export const ProductShowcase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formType, setFormType] = useState<"quote" | "consultation" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const { metrics, address } = location.state || {};

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['solar-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solar_products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
  }, [navigate, metrics]);

  if (!metrics) {
    navigate("/");
    return null;
  }

  const moduleCount = Math.round(metrics.kWp * 2);
  const annualProduction = Math.round(metrics.kWp * 950);
  const estimatedPrice = Math.round(metrics.kWp * 1950);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F75c03]/5 to-white">
      <div className="relative">
        <HeroImage />
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto mb-8 p-8 bg-white/90 backdrop-blur shadow-lg">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Ihre Solar-Analyse</h1>
              <PDFDownloadButton metrics={metrics} address={address} />
            </div>

            <SystemMetrics
              moduleCount={moduleCount}
              kWp={metrics.kWp}
              annualProduction={annualProduction}
              roofArea={metrics.roofArea}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SavingsCalculator yearlyProduction={annualProduction} />
            </div>

            <section className="py-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                Unsere Produkte für Sie
              </h2>
              <ProductGrid products={products} />
            </section>

            <CallToAction />
          </div>
        </Card>

        <div className="max-w-4xl mx-auto">
          <Testimonials />
          <FAQ />
        </div>
      </div>

      {!isAuthenticated && (
        <RegistrationOverlay onComplete={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
};