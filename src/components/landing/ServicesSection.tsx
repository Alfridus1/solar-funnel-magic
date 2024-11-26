import { motion } from "framer-motion";
import { 
  SunMedium, 
  Battery, 
  Lightbulb, 
  HomeIcon, 
  Car, 
  Wrench,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: SunMedium,
    title: "Premium Solarmodule",
    description: "Hocheffiziente 500W Full-Black Module von führenden Herstellern mit 25 Jahren Leistungsgarantie",
    color: "bg-amber-500"
  },
  {
    icon: Battery,
    title: "Huawei LUNA Speicher",
    description: "Modulare Batteriespeicher mit bis zu 30kWh Kapazität für maximale Unabhängigkeit",
    color: "bg-green-500"
  },
  {
    icon: Lightbulb,
    title: "Smart Home Integration",
    description: "Intelligentes Energiemanagement mit der HUAWEI FusionSolar App für optimale Verbrauchssteuerung",
    color: "bg-blue-500"
  },
  {
    icon: HomeIcon,
    title: "Luft-Wärmepumpen",
    description: "Effiziente Wärmepumpen mit COP >4.0 für umweltfreundliches Heizen und Kühlen",
    color: "bg-red-500"
  },
  {
    icon: Car,
    title: "EV Wallboxen",
    description: "Intelligente 11kW Ladestationen mit dynamischem Lastmanagement und Solar-Integration",
    color: "bg-purple-500"
  },
  {
    icon: Wrench,
    title: "Premium Service",
    description: "24/7 Monitoring, regelmäßige Wartung und 10 Jahre Komplettgarantie auf alle Komponenten",
    color: "bg-gray-500"
  }
];

export const ServicesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-solar-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Premium Komponenten für Ihr Zuhause
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Wir setzen ausschließlich auf hochwertige Markenprodukte für maximale Effizienz und Langlebigkeit
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8"
            >
              <div className={`${service.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                <service.icon className="h-9 w-9 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-solar-orange/10 to-solar-orange/5 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ihr Rundum-Sorglos-Paket
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Wir kümmern uns um alle Aspekte Ihrer Energiewende - von der ersten Beratung bis zum langfristigen Service
            </p>
            <Button 
              size="lg"
              className="bg-solar-orange hover:bg-solar-orange-dark text-white"
            >
              Jetzt beraten lassen
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};