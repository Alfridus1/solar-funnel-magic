import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface ProductDetailsProps {
  activeFeature: string;
}

const products = {
  solar: {
    title: "Full Black Module",
    image: "/lovable-uploads/fe437c08-df76-4ced-92d4-e82b0a6afe5c.png",
    description: "Hocheffiziente 500W Module für maximale Leistung",
    specs: ["500W Nennleistung", "21% Wirkungsgrad", "25 Jahre Garantie"],
  },
  inverter: {
    title: "Huawei SUN2000 Wechselrichter",
    image: "/lovable-uploads/fe437c08-df76-4ced-92d4-e82b0a6afe5c.png",
    description: "Intelligenter Wechselrichter für optimale Energieumwandlung",
    specs: ["98.6% Wirkungsgrad", "Integriertes Monitoring", "10 Jahre Garantie"],
  },
  battery: {
    title: "LUNA 2000 Speicher",
    image: "/lovable-uploads/fe437c08-df76-4ced-92d4-e82b0a6afe5c.png",
    description: "Modularer Speicher für maximale Flexibilität",
    specs: ["15kWh Kapazität", "95% Entladetiefe", "10 Jahre Garantie"],
  },
  heatpump: {
    title: "Wärmepumpe",
    image: "/lovable-uploads/fe437c08-df76-4ced-92d4-e82b0a6afe5c.png",
    description: "Effiziente Wärmepumpe für nachhaltige Heizung",
    specs: ["COP bis 5.0", "Smart Grid Ready", "7 Jahre Garantie"],
  },
};

export const ProductDetails = ({ activeFeature }: ProductDetailsProps) => {
  const product = products[activeFeature as keyof typeof products];

  return (
    <motion.div
      key={activeFeature}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white/80 backdrop-blur">
        <h3 className="text-2xl font-bold mb-4">{product.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-white">
            <img 
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain p-4"
            />
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-700">{product.description}</p>
            <ul className="space-y-2">
              {product.specs.map((spec, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};