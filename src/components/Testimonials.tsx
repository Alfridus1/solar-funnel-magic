import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Testimonials = () => {
  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="py-16 bg-gradient-to-br from-[#F75c03]/10 to-white/80 backdrop-blur rounded-2xl my-12">
      <h2 className="text-3xl font-bold text-center mb-12">Das sagen unsere Kunden</h2>
      <Carousel className="max-w-4xl mx-auto">
        <CarouselContent>
          {testimonials?.map((testimonial, index) => (
            <CarouselItem key={index}>
              <div className="p-6 text-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-[#F75c03] text-[#F75c03]" />
                  ))}
                </div>
                <p className="text-lg text-gray-700 italic mb-4">{testimonial.text}</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-[#F75c03]">{testimonial.role}</div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="border-[#F75c03]/20 hover:bg-[#F75c03]/10" />
        <CarouselNext className="border-[#F75c03]/20 hover:bg-[#F75c03]/10" />
      </Carousel>
    </div>
  );
};