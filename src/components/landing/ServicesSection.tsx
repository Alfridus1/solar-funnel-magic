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
    title: "Solaranlagen",
    description: "Hocheffiziente Photovoltaikanlagen für maximale Energiegewinnung",
    color: "bg-amber-500"
  },
  {
    icon: Battery,
    title: "Speichersysteme",
    description: "Moderne Batteriespeicher für optimale Energienutzung",
    color: "bg-green-500"
  },
  {
    icon: Lightbulb,
    title: "Energiemanagement",
    description: "Intelligente Steuerung Ihres Energieverbrauchs",
    color: "bg-blue-500"
  },
  {
    icon: HomeIcon,
    title: "Wärmepumpen",
    description: "Effiziente Heizungslösungen für Ihr Zuhause",
    color: "bg-red-500"
  },
  {
    icon: Car,
    title: "Wallboxen",
    description: "Ladestationen für Ihr Elektrofahrzeug",
    color: "bg-purple-500"
  },
  {
    icon: Wrench,
    title: "Service & Wartung",
    description: "Regelmäßige Wartung und schneller Support",
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
            Alles aus einer Hand
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Von der Planung bis zur Wartung - wir sind Ihr kompetenter Partner für die komplette Energiewende in Ihrem Zuhause
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className={`${service.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Button 
                variant="ghost" 
                className="text-solar-orange hover:text-solar-orange-dark hover:bg-solar-orange/10"
              >
                Mehr erfahren
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
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