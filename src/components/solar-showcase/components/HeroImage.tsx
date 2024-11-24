import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeroImageProps {
  className?: string;
}

export const HeroImage = ({ className }: HeroImageProps) => {
  return (
    <div className={cn("relative w-full overflow-hidden py-12", className)}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col justify-center items-center text-center p-8"
      >
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl text-gray-900 dark:text-white">
          Ihre maßgeschneiderte Solaranlage
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Premium Komponenten und professionelle Installation für maximale Effizienz
        </p>
      </motion.div>
    </div>
  );
};