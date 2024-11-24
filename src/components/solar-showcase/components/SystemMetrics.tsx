import { Card } from "@/components/ui/card";
import { Sun, Home, Zap, Battery } from "lucide-react";
import { motion } from "framer-motion";

interface SystemMetricsProps {
  moduleCount: number;
  kWp: number;
  annualProduction: number;
  roofArea: number;
}

export const SystemMetrics = ({ moduleCount, kWp, annualProduction, roofArea }: SystemMetricsProps) => {
  const co2Savings = Math.round(annualProduction * 0.69); // 690g = 0.69kg CO₂-Äquivalente pro kWh

  const metrics = [
    {
      icon: Sun,
      title: "Dachfläche",
      value: `${roofArea}m²`,
      subtitle: "Nutzbare Fläche",
      color: "text-amber-600",
      bgColor: "from-amber-50",
    },
    {
      icon: Home,
      title: "Module",
      value: `${moduleCount} Stück`,
      subtitle: "500W Full Black",
      color: "text-blue-600",
      bgColor: "from-blue-50",
    },
    {
      icon: Zap,
      title: "Anlagengröße",
      value: `${kWp.toFixed(1)} kWp`,
      subtitle: "Gesamtleistung",
      color: "text-emerald-600",
      bgColor: "from-emerald-50",
    },
    {
      icon: Battery,
      title: "Jahresertrag",
      value: `${annualProduction.toLocaleString()} kWh`,
      subtitle: `${co2Savings.toLocaleString()} kg CO₂/Jahr`,
      color: "text-purple-600",
      bgColor: "from-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`bg-gradient-to-br ${metric.bgColor} to-white p-4 rounded-xl hover:shadow-md transition-shadow`}>
            <div className={`flex items-center gap-2 ${metric.color} mb-2`}>
              <metric.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{metric.title}</span>
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.subtitle}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};