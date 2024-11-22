import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { PurchaseOptions } from "./PurchaseOptions";

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

export const PremiumProductsCarousel = () => {
  const [products, setProducts] = useState<PremiumProduct[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('premium_products')
        .select('*')
        .order('order_number');
      
      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      // Transform the data to ensure it matches our PremiumProduct interface
      const transformedData: PremiumProduct[] = data.map(item => ({
        ...item,
        purchase_options: item.purchase_options || {
          price: 0,
          financing: {
            available: false,
            min_rate: 0,
            max_term: 0
          }
        }
      }));

      setProducts(transformedData);
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        Unsere Premium Produkte für Sie
      </h2>
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow m-2">
                <div className="aspect-square bg-gradient-to-br from-solar-blue-50 to-white p-8">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-700 flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
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
                  <PurchaseOptions 
                    options={product.purchase_options}
                    onRequestQuote={() => setShowLeadForm(true)}
                  />
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};