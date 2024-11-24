import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

interface PremiumProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  climate_impact: string;
  purchase_options: {
    price: number;
    financing: {
      available: boolean;
      min_rate: number;
      max_term: number;
    };
  };
}

interface PremiumProductsSectionProps {
  onConsultationRequest: () => void;
}

export const PremiumProductsSection = ({ onConsultationRequest }: PremiumProductsSectionProps) => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['premium-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('premium_products')
        .select('*')
        .order('order_number');
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        purchase_options: typeof item.purchase_options === 'string' 
          ? JSON.parse(item.purchase_options)
          : item.purchase_options
      })) as PremiumProduct[];
    }
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 bg-gray-200 rounded-lg" />
      ))}
    </div>;
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        Premium Komponenten für Ihre Anlage
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-solar-blue-50 to-white p-6">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl">
                <p className="text-green-700 flex items-center gap-2 font-medium">
                  <Leaf className="h-5 w-5" />
                  {product.climate_impact}
                </p>
              </div>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-solar-orange" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t">
                <div className="mb-4">
                  <p className="text-2xl font-bold text-solar-orange">
                    {product.purchase_options.price.toLocaleString()}€
                  </p>
                  {product.purchase_options.financing.available && (
                    <p className="text-sm text-gray-600">
                      Finanzierung ab {product.purchase_options.financing.min_rate}% 
                      für bis zu {product.purchase_options.financing.max_term} Monate
                    </p>
                  )}
                </div>
                <Button 
                  className="w-full bg-solar-orange hover:bg-solar-orange/90"
                  onClick={onConsultationRequest}
                >
                  Beratung anfragen
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};