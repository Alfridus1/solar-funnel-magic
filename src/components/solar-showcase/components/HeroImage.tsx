import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeroImageProps {
  className?: string;
}

export const HeroImage = ({ className }: HeroImageProps) => {
  return (
    <div className={cn("relative w-full h-[400px] md:h-[500px] overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white text-center p-8"
      >
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
          Ihre maßgeschneiderte Solaranlage
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
          Premium Komponenten und professionelle Installation für maximale Effizienz
        </p>
      </motion.div>
      <img
        src="/lovable-uploads/03677377-bf21-4a7d-b8a4-c5f6e9b87885.png"
        alt="Modern solar house"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};