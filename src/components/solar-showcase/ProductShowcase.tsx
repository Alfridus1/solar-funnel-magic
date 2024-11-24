import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShowcaseHeader } from "./components/ShowcaseHeader";
import { ShowcaseContent } from "./components/ShowcaseContent";
import { RegistrationOverlay } from "./components/registration/RegistrationOverlay";
import type { Product } from "@/components/configurator/types";

const queryClient = new QueryClient();

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

  if (!metrics) return null;

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
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-solar-blue-50 to-white">
        <ShowcaseHeader />
        <ShowcaseContent 
          metrics={metrics}
          address={address}
          products={products}
          priceSettings={priceSettings}
          onQuoteRequest={handleQuoteRequest}
          onConsultationRequest={handleConsultationRequest}
          isAuthenticated={isAuthenticated}
        />
        {!isAuthenticated && showLeadForm && (
          <RegistrationOverlay 
            onComplete={() => setIsAuthenticated(true)} 
            metrics={metrics}
            address={address}
          />
        )}
      </div>
    </QueryClientProvider>
  );
};