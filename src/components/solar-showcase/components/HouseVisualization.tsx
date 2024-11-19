import { motion, AnimatePresence } from "framer-motion";
import { Sun, Battery, Home, Zap, Car, Thermometer } from "lucide-react";

interface HouseVisualizationProps {
  activeFeature: string;
}

export const HouseVisualization = ({ activeFeature }: HouseVisualizationProps) => {
  return (
    <div className="relative aspect-[16/9] mb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-solar-blue/20 to-transparent rounded-xl overflow-hidden">
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
            {activeFeature === "solar" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-1/4 left-1/4 bg-yellow-400/20 p-4 rounded-lg backdrop-blur-sm"
              >
                <Sun className="h-8 w-8 text-yellow-500 mb-2" />
                <p className="text-sm font-semibold">500W Full Black Module</p>
              </motion.div>
            )}
            
            {activeFeature === "inverter" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-1/3 right-1/3 bg-blue-400/20 p-4 rounded-lg backdrop-blur-sm"
              >
                <Zap className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm font-semibold">Huawei SUN2000</p>
              </motion.div>
            )}
            
            {activeFeature === "battery" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute bottom-1/4 left-1/3 bg-green-400/20 p-4 rounded-lg backdrop-blur-sm"
              >
                <Battery className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm font-semibold">LUNA 2000 Speicher</p>
              </motion.div>
            )}

            {activeFeature === "heatpump" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute top-1/3 right-1/4 bg-red-400/20 p-4 rounded-lg backdrop-blur-sm"
              >
                <Thermometer className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-sm font-semibold">Wärmepumpe</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};