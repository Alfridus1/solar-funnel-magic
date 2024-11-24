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
  inclusion_type: 'included' | 'optional';
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
        Premium Komponenten für Ihre Anlage
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-solar-blue-50 to-white p-4 md:p-6">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <h3 className="text-lg md:text-xl font-semibold">{product.name}</h3>
              <p className="text-sm md:text-base text-gray-600">{product.description}</p>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 md:p-4 rounded-xl">
                <p className="text-green-700 flex items-center gap-2 font-medium text-sm md:text-base">
                  <Leaf className="h-4 w-4 md:h-5 md:w-5" />
                  {product.climate_impact}
                </p>
              </div>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm md:text-base">
                    <div className="w-1.5 h-1.5 rounded-full bg-solar-orange flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t">
                <div className="mb-4">
                  <p className="text-xl md:text-2xl font-bold text-solar-orange">
                    {product.purchase_options.price.toLocaleString()}€
                  </p>
                  {product.purchase_options.financing.available && (
                    <p className="text-xs md:text-sm text-gray-600">
                      Finanzierung ab {product.purchase_options.financing.min_rate}% 
                      für bis zu {product.purchase_options.financing.max_term} Monate
                    </p>
                  )}
                </div>
                <Button 
                  className={`w-full ${
                    product.inclusion_type === 'included' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-solar-orange hover:bg-solar-orange/90'
                  }`}
                  onClick={onConsultationRequest}
                >
                  {product.inclusion_type === 'included' 
                    ? 'Im Paket enthalten' 
                    : 'Optional hinzufügbar'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};