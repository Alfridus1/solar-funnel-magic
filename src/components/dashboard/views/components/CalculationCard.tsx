import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Euro, TrendingUp, Trash2 } from "lucide-react";
import { PDFDownloadButton } from "@/components/solar-showcase/components/PDFDownloadButton";
import type { LeadCalculation } from "../types/LeadCalculation";

interface CalculationCardProps {
  calculation: LeadCalculation;
  onDelete: (id: string, event: React.MouseEvent) => void;
  onClick: (calculation: LeadCalculation) => void;
}

export const CalculationCard = ({
  calculation: calc,
  onDelete,
  onClick,
}: CalculationCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(calc)}
    >
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-lg">
          Solaranlage vom {new Date(calc.created_at).toLocaleDateString('de-DE')}
          {calc.address && (
            <div className="text-sm text-gray-600 mt-1">
              Standort: {calc.address}
            </div>
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={(e) => onDelete(calc.id, e)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
            <Sun className="h-5 w-5 text-solar-orange" />
            <div>
              <p className="text-sm text-gray-600">Anlagengröße</p>
              <p className="font-semibold">{calc.metrics?.kWp || 0} kWp</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <Euro className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Geschätzter Preis</p>
              <p className="font-semibold">{calc.metrics?.estimatedPrice?.toLocaleString('de-DE') || 0}€</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Jährliche Einsparung</p>
              <p className="font-semibold">{calc.metrics?.annualSavings?.toLocaleString('de-DE') || 0}€</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              onClick(calc);
            }}
            className="text-solar-orange border-solar-orange hover:bg-solar-orange/10"
          >
            Details anzeigen
          </Button>
          
          {calc.metrics && calc.address && (
            <PDFDownloadButton 
              metrics={calc.metrics}
              address={calc.address}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};