import { Card } from "@/components/ui/card";
import { useModuleCalculations } from "../hooks/useModuleCalculations";

interface RoofCalculationsProps {
  polygon: google.maps.Polygon | null;
}

export const RoofCalculations = ({ polygon }: RoofCalculationsProps) => {
  const { moduleCount, totalPower, roofArea, efficiency } = useModuleCalculations(polygon);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Dachfläche</h3>
        <p className="text-2xl font-bold">{Math.round(roofArea)}m²</p>
      </Card>
      
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Mögliche Module</h3>
        <p className="text-2xl font-bold">{moduleCount}</p>
      </Card>
      
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Gesamtleistung</h3>
        <p className="text-2xl font-bold">{totalPower}Wp</p>
      </Card>
      
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Flächeneffizienz</h3>
        <p className="text-2xl font-bold">{efficiency}%</p>
      </Card>
    </div>
  );
};