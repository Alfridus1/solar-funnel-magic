import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sun, Battery, TrendingUp } from "lucide-react";

interface SolarMetricsProps {
  kWp: number;
  yearlyProduction: number;
  annualSavings: number;
}

export const SolarMetrics = ({ kWp, yearlyProduction, annualSavings }: SolarMetricsProps) => {
  const metrics = [
    {
      icon: Sun,
      value: `${kWp} kWp`,
      label: "Anlagenleistung",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      icon: Battery,
      value: `${yearlyProduction.toLocaleString()} kWh`,
      label: "Jährliche Produktion",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      icon: TrendingUp,
      value: `${annualSavings.toLocaleString()} €`,
      label: "Jährliche Einsparung",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-center">
        Ihre Solaranlage
      </h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "p-6 transition-shadow hover:shadow-lg",
              metric.bgColor,
              "border-none"
            )}>
              <metric.icon className={cn("h-8 w-8 mb-4", metric.color)} />
              <div className="space-y-1">
                <p className="text-3xl font-bold">{metric.value}</p>
                <p className="text-gray-600">{metric.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};