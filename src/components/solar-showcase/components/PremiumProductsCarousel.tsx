import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "./ProductCard";
import type { CarouselApi } from "@/components/ui/carousel";

interface PremiumProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  climate_impact: string;
}

interface SupabaseProduct extends PremiumProduct {
  order_number: number;
}

export const PremiumProductsCarousel = () => {
  const [products, setProducts] = useState<PremiumProduct[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

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

      setProducts(data as SupabaseProduct[]);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-12 relative">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          
          <Carousel
            opts={{
              loop: true,
              align: 'center',
              skipSnaps: false,
            }}
            className="relative"
            setApi={setApi}
          >
            <CarouselContent>
              {products.map((product, index) => (
                <CarouselItem 
                  key={product.id} 
                  className="md:basis-1/2 lg:basis-1/3 transition-all duration-300 px-4"
                >
                  <ProductCard 
                    product={product}
                    isActive={index === activeIndex}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 transform -translate-y-1/2" />
            <CarouselNext className="absolute -right-12 top-1/2 transform -translate-y-1/2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};