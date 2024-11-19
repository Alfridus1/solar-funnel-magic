import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Battery, 
  Home, 
  Zap, 
  Car, 
  Thermometer
} from "lucide-react";

interface ShowcaseMetrics {
  monthlyProduction: number;
  annualSavings: number;
  roofArea: number;
  possiblePanels: number;
  kWp: number;
}

interface ProductShowcaseProps {
  metrics: ShowcaseMetrics;
}

export const ProductShowcase = ({ metrics }: ProductShowcaseProps) => {
  const [activeFeature, setActiveFeature] = useState<string>("solar");
  
  const yearlyProduction = metrics.monthlyProduction * 12;
  const dailyConsumption = yearlyProduction / 365;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Key Metrics */}
      <div className="container mx-auto px-4 pt-8">
        <h1 className="text-5xl font-bold text-center mb-12">Ihre Solaranlage</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
          <div>
            <h2 className="text-4xl font-bold">{metrics.kWp}kWp</h2>
            <p className="text-gray-600">Anlagenleistung</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold">{yearlyProduction.toLocaleString()}kWh</h2>
            <p className="text-gray-600">Jährliche Produktion</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold">{metrics.annualSavings.toLocaleString()}€</h2>
            <p className="text-gray-600">Jährliche Einsparung</p>
          </div>
        </div>

        {/* Interactive House Visualization */}
        <div className="relative aspect-[16/9] mb-16">
          <div className="absolute inset-0 bg-gradient-to-b from-solar-blue/20 to-transparent rounded-xl overflow-hidden">
            <motion.div 
              className="w-full h-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* House Base Image */}
              <img 
                src="/lovable-uploads/f2d1edec-2b0f-4af0-9ec8-9e7caf7a8ea7.png"
                alt="Smart Home Visualization"
                className="w-full h-full object-cover rounded-xl"
              />
              
              {/* Animated Overlays */}
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
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Feature Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <Button
            variant={activeFeature === "solar" ? "default" : "outline"}
            onClick={() => setActiveFeature("solar")}
            className="p-6 h-auto flex flex-col items-center gap-2"
          >
            <Sun className="h-6 w-6" />
            <span>Solarmodule</span>
          </Button>
          
          <Button
            variant={activeFeature === "inverter" ? "default" : "outline"}
            onClick={() => setActiveFeature("inverter")}
            className="p-6 h-auto flex flex-col items-center gap-2"
          >
            <Zap className="h-6 w-6" />
            <span>Wechselrichter</span>
          </Button>
          
          <Button
            variant={activeFeature === "battery" ? "default" : "outline"}
            onClick={() => setActiveFeature("battery")}
            className="p-6 h-auto flex flex-col items-center gap-2"
          >
            <Battery className="h-6 w-6" />
            <span>Speicher</span>
          </Button>
          
          <Button
            variant={activeFeature === "heating" ? "default" : "outline"}
            onClick={() => setActiveFeature("heating")}
            className="p-6 h-auto flex flex-col items-center gap-2"
          >
            <Thermometer className="h-6 w-6" />
            <span>Wärmepumpe</span>
          </Button>
        </div>

        {/* Feature Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto mb-16"
          >
            {activeFeature === "solar" && (
              <Card className="p-6">
                <h3 className="text-2xl font-bold mb-4">Full Black Module</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src="/lovable-uploads/fe437c08-df76-4ced-92d4-e82b0a6afe5c.png"
                      alt="Solar Module"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg">Hocheffiziente 500W Module für maximale Leistung</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-yellow-500" />
                        <span>500W Nennleistung</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-500" />
                        <span>21% Wirkungsgrad</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-green-500" />
                        <span>25 Jahre Garantie</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Similar cards for other features */}
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <Button size="lg" className="bg-solar-orange hover:bg-solar-orange/90 text-white px-8 py-6 text-lg">
            Jetzt konfigurieren
          </Button>
        </div>
      </div>
    </div>
  );
};