import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PremiumProductsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: products } = useQuery({
    queryKey: ['premium-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('premium_products')
        .select('*')
        .order('order_number');
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (!products) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products.map((product, index) => (
            <div key={product.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4">
              <Card className="h-full bg-white/80 backdrop-blur">
                <div className="relative aspect-video">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-solar-orange rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur hover:bg-white"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur hover:bg-white"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};