import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Benefits } from "@/components/Benefits";

interface RoofDetail {
  roofId: string;
  moduleCount: number;
}

interface RoofMetricsProps {
  monthlyProduction: number;
  annualSavings: number;
  roofArea: number;
  possiblePanels: number;
  kWp: number;
  roofDetails: RoofDetail[];
  onContinue: () => void;
}

export const RoofMetrics = ({
  monthlyProduction,
  annualSavings,
  roofArea,
  possiblePanels,
  kWp,
  roofDetails,
  onContinue
}: RoofMetricsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ihre Potenzialanalyse</h2>
        <p className="text-gray-600">
          Basierend auf Ihrer Dachfläche haben wir folgende Werte berechnet:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-solar-blue-50 to-white">
          <div className="text-center">
            <p className="text-sm text-gray-600">Monatliche Produktion</p>
            <p className="text-2xl font-bold">{monthlyProduction.toLocaleString('de-DE')} kWh</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-solar-orange-50 to-white">
          <div className="text-center">
            <p className="text-sm text-gray-600">Jährliche Einsparungen</p>
            <p className="text-2xl font-bold">{annualSavings.toLocaleString('de-DE')}€</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-white">
          <div className="text-center">
            <p className="text-sm text-gray-600">Nutzbare Dachfläche</p>
            <p className="text-2xl font-bold">{roofArea.toFixed(2)} m²</p>
          </div>
        </Card>
      </div>

      <Benefits />

      <div className="flex justify-center">
        <Button 
          onClick={onContinue}
          className="bg-solar-orange hover:bg-solar-orange-600 text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Weiter zur Analyse
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};