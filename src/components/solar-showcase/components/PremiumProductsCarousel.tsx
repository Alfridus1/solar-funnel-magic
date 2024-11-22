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
import { cn } from "@/lib/utils";

interface PremiumProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  climate_impact: string;
}

interface SupabaseProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  climate_impact: string;
  order_number: number;
}

export const PremiumProductsCarousel = () => {
  const [products, setProducts] = useState<PremiumProduct[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

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

      const transformedData: PremiumProduct[] = (data as SupabaseProduct[]);
      setProducts(transformedData);
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-12">
      <div className="w-full max-w-7xl mx-auto px-4">
        <Carousel
          opts={{
            loop: true,
            align: 'center',
            skipSnaps: false,
          }}
          className="relative"
          onSelect={(api) => {
            setActiveIndex(api.selectedScrollSnap());
          }}
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem 
                key={product.id} 
                className="md:basis-1/2 lg:basis-1/3 transition-all duration-300"
              >
                <div className={cn(
                  "transition-all duration-500",
                  index === activeIndex ? "scale-110 z-10" : "scale-90 opacity-70"
                )}>
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
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-12 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="absolute -right-12 top-1/2 transform -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
};