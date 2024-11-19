import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { getFeatureConfig } from "../utils/featureConfig";
import { cn } from "@/lib/utils";

interface SystemVisualizerProps {
  activeFeature: string;
}

export const SystemVisualizer = ({ activeFeature }: SystemVisualizerProps) => {
  const feature = getFeatureConfig(activeFeature);

  return (
    <Card className="relative aspect-[16/9] overflow-hidden bg-gradient-to-b from-blue-50/50 to-white border-none">
      <div className="absolute inset-0 p-6">
        <img 
          src="/house-visualization.png" 
          alt="Haus Visualisierung"
          className="w-full h-full object-contain"
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "absolute p-4 rounded-lg backdrop-blur-sm",
              feature.position,
              feature.backgroundColor
            )}
          >
            <feature.icon className={cn("h-6 w-6 mb-2", feature.iconColor)} />
            <p className="text-sm font-medium">{feature.label}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
};