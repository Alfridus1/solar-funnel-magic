import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface ProductDetailsProps {
  activeFeature: string;
}

export const ProductDetails = ({ activeFeature }: ProductDetailsProps) => {
  return (
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
                <li>500W Nennleistung</li>
                <li>21% Wirkungsgrad</li>
                <li>25 Jahre Garantie</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {activeFeature === "inverter" && (
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-4">Huawei SUN2000 Wechselrichter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"
                alt="Inverter"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-lg">Intelligenter Wechselrichter für optimale Energieumwandlung</p>
              <ul className="space-y-2">
                <li>98.6% Wirkungsgrad</li>
                <li>Integriertes Monitoring</li>
                <li>10 Jahre Garantie</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {activeFeature === "battery" && (
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-4">LUNA 2000 Speicher</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1496307653780-42ee777d4833"
                alt="Battery"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-lg">Modularer Speicher für maximale Flexibilität</p>
              <ul className="space-y-2">
                <li>15kWh Kapazität</li>
                <li>95% Entladetiefe</li>
                <li>10 Jahre Garantie</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {activeFeature === "heatpump" && (
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-4">Wärmepumpe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625"
                alt="Heat Pump"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-lg">Effiziente Wärmepumpe für nachhaltige Heizung</p>
              <ul className="space-y-2">
                <li>COP bis 5.0</li>
                <li>Smart Grid Ready</li>
                <li>7 Jahre Garantie</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};