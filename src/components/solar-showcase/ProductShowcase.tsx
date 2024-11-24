import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShowcaseHeader } from "./components/ShowcaseHeader";
import { ShowcaseContent } from "./components/ShowcaseContent";
import { RegistrationOverlay } from "./components/registration/RegistrationOverlay";
import { ShowcaseLayout } from "./components/ShowcaseLayout";
import type { Product } from "@/components/configurator/types";
import { v4 as uuidv4 } from 'uuid';

const queryClient = new QueryClient();

export const ProductShowcase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const { metrics, address } = location.state || {};

  useEffect(() => {
    if (!metrics) {
      navigate("/");
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      // If user is authenticated, save the request
      if (session?.user) {
        try {
          console.log('Starting to save calculation...');
          
          // First get user profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email, phone')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile error:', profileError);
            throw profileError;
          }
          
          if (!profile) {
            console.error('No profile found');
            throw new Error('Profile not found');
          }

          console.log('Profile found:', profile);

          const calculationId = uuidv4();
          const leadData = {
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
            phone: profile.phone || '',
            type: 'calculation',
            metrics,
            address,
            user_id: session.user.id,
            calculation_id: calculationId,
            status: 'new'
          };

          console.log('Attempting to insert lead with data:', leadData);

          const { error: leadError } = await supabase
            .from('leads')
            .insert(leadData);

          if (leadError) {
            console.error('Lead insert error:', leadError);
            throw leadError;
          }

          console.log('Lead saved successfully');

          toast({
            title: "Anfrage gespeichert",
            description: "Sie können diese Auswertung später in Ihrem Kundenportal einsehen.",
          });
        } catch (error: any) {
          console.error('Error saving calculation:', error);
          toast({
            title: "Fehler beim Speichern",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, metrics, address, toast]);

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
    toast({
      title: "Angebot angefordert",
      description: "Wir werden uns in Kürze bei Ihnen melden.",
    });
  };

  const handleConsultationRequest = () => {
    toast({
      title: "Beratungstermin angefordert",
      description: "Wir werden uns in Kürze bei Ihnen melden um einen Termin zu vereinbaren.",
    });
  };

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
        </div>
      </ShowcaseLayout>
    </QueryClientProvider>
  );
};