import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Sun, Battery, Zap, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "panels",
    label: "Solarmodule",
    icon: Sun,
    position: "top-4 left-4",
    iconColor: "text-yellow-500",
    backgroundColor: "bg-yellow-50/80"
  },
  {
    id: "inverter",
    label: "Wechselrichter",
    icon: Zap,
    position: "top-4 right-4",
    iconColor: "text-blue-500",
    backgroundColor: "bg-blue-50/80"
  },
  {
    id: "battery",
    label: "Speicher",
    icon: Battery,
    position: "bottom-4 left-4",
    iconColor: "text-green-500",
    backgroundColor: "bg-green-50/80"
  },
  {
    id: "home",
    label: "Smart Home",
    icon: Home,
    position: "bottom-4 right-4",
    iconColor: "text-purple-500",
    backgroundColor: "bg-purple-50/80"
  }
];

export const SystemVisualizer = () => {
  const [activeFeature, setActiveFeature] = useState("panels");

  return (
    <Card className="relative aspect-[16/9] overflow-hidden bg-gradient-to-b from-blue-50/50 to-white border-none">
      <div className="absolute inset-0 p-6">
        <img 
          src="/lovable-uploads/2b67e439-3bd1-4ad6-8498-ee34e8f6d45f.png"
          alt="Modernes Solarhaus mit Elektroauto"
          className="w-full h-full object-contain"
        />
        
        <AnimatePresence mode="wait">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: activeFeature === feature.id ? 1 : 0.7,
                scale: activeFeature === feature.id ? 1 : 0.95
              }}
              className={cn(
                "absolute p-4 rounded-lg backdrop-blur-sm cursor-pointer",
                feature.position,
                feature.backgroundColor,
                activeFeature === feature.id ? "ring-2 ring-offset-2 ring-blue-500" : ""
              )}
              onClick={() => setActiveFeature(feature.id)}
            >
              <feature.icon className={cn("h-6 w-6 mb-2", feature.iconColor)} />
              <p className="text-sm font-medium">{feature.label}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};