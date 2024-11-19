import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getFeatureConfig } from "../utils/featureConfig";

interface HouseVisualizationProps {
  activeFeature: string;
  metrics: {
    kWp: number;
    yearlyProduction: number;
    annualSavings: number;
  };
}

export const HouseVisualization = ({ activeFeature, metrics }: HouseVisualizationProps) => {
  const feature = getFeatureConfig(activeFeature);

  return (
    <div className="relative aspect-video bg-gradient-to-b from-solar-blue/20 to-transparent rounded-2xl overflow-hidden shadow-lg">
      <motion.div 
        className="w-full h-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src="/lovable-uploads/f2d1edec-2b0f-4af0-9ec8-9e7caf7a8ea7.png"
          alt="Smart Home Visualization"
          className="w-full h-full object-cover"
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "absolute p-6 rounded-xl backdrop-blur-sm border",
              feature.position,
              feature.backgroundColor + "/10",
              "border-" + feature.backgroundColor.split("-")[1] + "-500/30"
            )}
          >
            <feature.icon className={cn("h-8 w-8 mb-2", feature.iconColor)} />
            <p className="text-sm font-medium">{feature.label}</p>
            <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm"
          >
            <p className="text-sm text-gray-600">Anlagenleistung</p>
            <p className="text-lg font-bold">{metrics.kWp} kWp</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm"
          >
            <p className="text-sm text-gray-600">Jahresproduktion</p>
            <p className="text-lg font-bold">{metrics.yearlyProduction} kWh</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm"
          >
            <p className="text-sm text-gray-600">Jährliche Einsparung</p>
            <p className="text-lg font-bold">{metrics.annualSavings}€</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};