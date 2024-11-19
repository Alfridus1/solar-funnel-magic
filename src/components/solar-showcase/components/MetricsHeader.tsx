import { motion } from "framer-motion";

interface MetricsHeaderProps {
  kWp: number;
  yearlyProduction: number;
  annualSavings: number;
}

export const MetricsHeader = ({ kWp, yearlyProduction, annualSavings }: MetricsHeaderProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-4xl font-bold">{kWp}kWp</h2>
        <p className="text-gray-600">Anlagenleistung</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-4xl font-bold">{yearlyProduction.toLocaleString()}kWh</h2>
        <p className="text-gray-600">Jährliche Produktion</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-bold">{annualSavings.toLocaleString()}€</h2>
        <p className="text-gray-600">Jährliche Einsparung</p>
      </motion.div>
    </div>
  );
};