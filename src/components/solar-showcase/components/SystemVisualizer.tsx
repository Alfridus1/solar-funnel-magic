import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { getFeatureConfig } from "../utils/featureConfig";
import { cn } from "@/lib/utils";

interface SystemVisualizerProps {
  activeFeature: string;
}

export const SystemVisualizer = ({ activeFeature }: SystemVisualizerProps) => {
  const feature = getFeatureConfig(activeFeature) || {
    position: "top-4 left-4",
    backgroundColor: "bg-white/80",
    iconColor: "text-blue-500",
    icon: () => null,
    label: "",
  };

  return (
    <Card className="relative aspect-[16/9] overflow-hidden bg-gradient-to-b from-blue-50/50 to-white border-none">
      <div className="absolute inset-0 p-6">
        <img 
          src="/lovable-uploads/2b67e439-3bd1-4ad6-8498-ee34e8f6d45f.png"
          alt="Modernes Solarhaus mit Elektroauto"
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
            {feature.icon && <feature.icon className={cn("h-6 w-6 mb-2", feature.iconColor)} />}
            <p className="text-sm font-medium">{feature.label}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
};