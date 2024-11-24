import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShowcaseHeader } from "./components/ShowcaseHeader";
import { ShowcaseContent } from "./components/ShowcaseContent";
import { RegistrationOverlay } from "./components/registration/RegistrationOverlay";
import { ShowcaseLayout } from "./components/ShowcaseLayout";
import { LeadFormOverlay } from "./components/LeadFormOverlay";
import type { Product } from "@/components/configurator/types";

const queryClient = new QueryClient();

export const ProductShowcase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formType, setFormType] = useState<"quote" | "consultation" | null>(null);
  const { toast } = useToast();
  
  // Try to get metrics and address from location state or localStorage
  const metricsFromStorage = localStorage.getItem('solarMetrics');
  const metrics = location.state?.metrics || (metricsFromStorage ? JSON.parse(metricsFromStorage) : null);
  const address = location.state?.address || localStorage.getItem('solarAddress');

  useEffect(() => {
    // Store metrics in localStorage if they come from location state
    if (location.state?.metrics) {
      localStorage.setItem('solarMetrics', JSON.stringify(location.state.metrics));
    }
    if (location.state?.address) {
      localStorage.setItem('solarAddress', location.state.address);
    }

    // Only redirect if there are no metrics in both state and localStorage
    if (!metrics) {
      toast({
        title: "Keine Daten vorhanden",
        description: "Bitte starten Sie den Prozess von vorne.",
        variant: "destructive"
      });
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
  }, [navigate, metrics, location.state, toast]);

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

  const handleQuoteRequest = () => {
    setFormType("quote");
  };

  const handleConsultationRequest = () => {
    setFormType("consultation");
  };

  // Guard against missing metrics
  if (!metrics) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ShowcaseLayout>
        <div className="min-h-screen relative">
          <ShowcaseHeader />
          <div className={`${!isAuthenticated ? 'blur-md' : ''}`}>
            <ShowcaseContent 
              metrics={metrics}
              address={address}
              products={products}
              priceSettings={priceSettings}
              isAuthenticated={isAuthenticated}
              onQuoteRequest={handleQuoteRequest}
              onConsultationRequest={handleConsultationRequest}
            />
          </div>
          
          {!isAuthenticated && (
            <RegistrationOverlay 
              onComplete={() => setIsAuthenticated(true)}
              metrics={metrics}
              address={address}
            />
          )}

          {formType && (
            <LeadFormOverlay
              formType={formType}
              metrics={metrics}
              address={address}
              onClose={() => setFormType(null)}
            />
          )}
        </div>
      </ShowcaseLayout>
    </QueryClientProvider>
  );
};
