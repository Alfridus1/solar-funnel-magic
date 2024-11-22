import { Star, Sun } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const Testimonials = () => {
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="py-16 bg-gradient-to-br from-[#F75c03]/10 to-white/80 backdrop-blur rounded-2xl my-12 relative overflow-hidden">
      {/* Animated sun background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -right-4 text-[#F75c03]/10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sun className="w-32 h-32" />
        </motion.div>
        <motion.div
          className="absolute -bottom-4 -left-4 text-[#F75c03]/10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sun className="w-24 h-24" />
        </motion.div>
      </div>

      <motion.h2 
        className="text-3xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Das sagen unsere Kunden
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
        {testimonials?.map((testimonial, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              y: -5,
              boxShadow: "0 10px 30px -10px rgba(247, 92, 3, 0.2)",
            }}
            className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-lg group"
          >
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + i * 0.1 }}
                >
                  <Star className="h-5 w-5 fill-[#F75c03] text-[#F75c03]" />
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <p className="text-gray-700 italic mb-4 min-h-[100px]">{testimonial.text}</p>
              <div className="border-t pt-4">
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-[#F75c03] text-sm">{testimonial.role}</div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};