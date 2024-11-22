import { Star } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
        {testimonials?.map((testimonial, index) => (
          <div 
            key={index}
            className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#F75c03] text-[#F75c03]" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-4 min-h-[100px]">{testimonial.text}</p>
            <div className="border-t pt-4">
              <div className="font-semibold">{testimonial.name}</div>
              <div className="text-[#F75c03] text-sm">{testimonial.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};