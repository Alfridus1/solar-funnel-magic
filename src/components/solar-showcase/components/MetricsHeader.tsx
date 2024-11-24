import { motion } from "framer-motion";
import { Sun, Battery, ChartBar } from "lucide-react";

interface MetricsHeaderProps {
  metrics: {
    kWp: number;
    roofArea: number;
  };
}

export const MetricsHeader = ({ metrics }: MetricsHeaderProps) => {
  // Calculate values based on kWp
  const yearlyProduction = Math.round(metrics.kWp * 950); // 950kWh per kWp per year
  const annualSavings = Math.round(yearlyProduction * 0.30); // 30 cents per kWh

  const metricsData = [
    {
      icon: Sun,
      value: `${metrics.kWp.toFixed(1)} kWp`,
      label: "Anlagenleistung",
      color: "text-yellow-500",
    },
    {
      icon: Battery,
      value: `${yearlyProduction.toLocaleString()} kWh`,
      label: "Jährliche Produktion",
      color: "text-green-500",
    },
    {
      icon: ChartBar,
      value: `${annualSavings.toLocaleString()} €`,
      label: "Jährliche Einsparung",
      color: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {metricsData.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <metric.icon className={`h-8 w-8 ${metric.color} mb-4`} />
          <h2 className="text-4xl font-bold">{metric.value}</h2>
          <p className="text-gray-600">{metric.label}</p>
        </motion.div>
      ))}
    </div>
  );
};