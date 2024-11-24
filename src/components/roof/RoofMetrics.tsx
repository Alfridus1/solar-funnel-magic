import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
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
  onAddRoof?: () => void;
}

export const RoofMetrics = ({
  monthlyProduction,
  annualSavings,
  roofArea,
  possiblePanels,
  kWp,
  roofDetails,
  onContinue,
  onAddRoof
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

      {roofDetails.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Dachflächen Übersicht</h3>
          <div className="space-y-4">
            {roofDetails.map((detail, index) => (
              <div key={detail.roofId} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <span className="font-medium">Dachfläche {index + 1}</span>
                <span>{detail.moduleCount} Module</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <Button 
          variant="outline"
          onClick={onAddRoof}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Weitere Dachfläche hinzufügen
        </Button>

        <Button 
          onClick={onContinue}
          className="bg-solar-orange hover:bg-solar-orange-600 text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Jetzt Ihre Einsparungen erfahren
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <Benefits />
    </motion.div>
  );
};