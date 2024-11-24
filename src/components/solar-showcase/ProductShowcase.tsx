import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ShowcaseContent } from "./components/ShowcaseContent";

interface ProductShowcaseProps {
  metrics: any;
  address: any;
  isAuthenticated: boolean;
}

export const ProductShowcase = ({ metrics, address, isAuthenticated }: ProductShowcaseProps) => {
  const { toast } = useToast();

  const { data: products = [] } = useQuery({
    queryKey: ['solar-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solar_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Fehler beim Laden der Produkte",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as Product[];
    }
  });

  const { data: priceSettings } = useQuery({
    queryKey: ['price-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_settings')
        .select('*')
        .single();

      if (error) {
        toast({
          title: "Fehler beim Laden der Preiseinstellungen",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      return data;
    }
  });

  const handleQuoteRequest = () => {
    toast({
      title: "Anfrage gesendet",
      description: "Wir werden uns in Kürze bei Ihnen melden.",
    });
  };

  const handleConsultationRequest = () => {
    toast({
      title: "Beratungstermin angefragt",
      description: "Wir werden uns in Kürze bei Ihnen melden.",
    });
  };

  if (!metrics) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
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
    </div>
  );
};