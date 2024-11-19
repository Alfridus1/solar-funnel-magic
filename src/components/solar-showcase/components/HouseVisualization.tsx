import { motion, AnimatePresence } from "framer-motion";
import { Sun, Battery, Zap, Thermometer } from "lucide-react";

interface HouseVisualizationProps {
  activeFeature: string;
}

export const HouseVisualization = ({ activeFeature }: HouseVisualizationProps) => {
  const features = [
    {
      id: "solar",
      icon: Sun,
      position: "top-1/4 left-1/4",
      color: "yellow",
      label: "500W Full Black Module",
    },
    {
      id: "inverter",
      icon: Zap,
      position: "bottom-1/3 right-1/3",
      color: "blue",
      label: "Huawei SUN2000",
    },
    {
      id: "battery",
      icon: Battery,
      position: "bottom-1/4 left-1/3",
      color: "green",
      label: "LUNA 2000 Speicher",
    },
    {
      id: "heatpump",
      icon: Thermometer,
      position: "top-1/3 right-1/4",
      color: "red",
      label: "Wärmepumpe",
    },
  ];

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-b from-solar-blue/20 to-transparent shadow-lg">
      <motion.div 
        className="w-full h-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src="/lovable-uploads/f2d1edec-2b0f-4af0-9ec8-9e7caf7a8ea7.png"
          alt="Smart Home Visualization"
          className="w-full h-full object-cover rounded-xl"
        />
        
        <AnimatePresence>
          {features.map((feature) => (
            activeFeature === feature.id && (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute ${feature.position} bg-${feature.color}-500/20 p-4 rounded-lg backdrop-blur-sm border border-${feature.color}-500/30`}
              >
                <feature.icon className={`h-8 w-8 text-${feature.color}-500 mb-2`} />
                <p className="text-sm font-semibold">{feature.label}</p>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};