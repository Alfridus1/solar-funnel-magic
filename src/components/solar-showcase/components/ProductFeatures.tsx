import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFeatureConfig } from "../utils/featureConfig";
import { cn } from "@/lib/utils";

interface ProductFeaturesProps {
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
}

export const ProductFeatures = ({ activeFeature, onFeatureSelect }: ProductFeaturesProps) => {
  const features = ["solar", "inverter", "battery", "heatpump"];

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        {features.map((feature) => {
          const config = getFeatureConfig(feature);
          return (
            <Button
              key={feature}
              variant={activeFeature === feature ? "default" : "outline"}
              onClick={() => onFeatureSelect(feature)}
              className={cn(
                "w-14 h-14 rounded-full p-0 transition-all duration-300",
                activeFeature === feature && config.backgroundColor
              )}
            >
              <config.icon className={cn(
                "h-6 w-6",
                activeFeature === feature ? "text-white" : config.iconColor
              )} />
            </Button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <ProductDetail feature={activeFeature} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ProductDetail = ({ feature }: { feature: string }) => {
  const config = getFeatureConfig(feature);
  
  return (
    <Card className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">{config.title}</h3>
          <p className="text-gray-600">{config.description}</p>
          <ul className="space-y-2">
            {config.specs.map((spec, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", config.iconColor)} />
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-square">
          <img 
            src={config.image} 
            alt={config.title}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </Card>
  );
};