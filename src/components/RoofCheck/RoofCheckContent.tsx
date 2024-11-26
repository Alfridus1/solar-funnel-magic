import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoofDesigner } from "@/components/roof/RoofDesigner";
import { RoofMetrics } from "@/components/roof/RoofMetrics";

interface RoofCheckContentProps {
  address: string;
  handleRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
  handleFinish: () => void;
  paths: google.maps.LatLng[][];
  metrics: any;
  onLog?: (message: string) => void;
}

export const RoofCheckContent = ({
  address,
  handleRoofOutlineComplete,
  handleFinish,
  paths,
  metrics,
  onLog
}: RoofCheckContentProps) => {
  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Zeichnen Sie Ihr Dach ein</h1>
              <p className="text-gray-600">
                Klicken Sie auf die Ecken Ihres Daches, um die Fläche einzuzeichnen.
                Sie können mehrere Dachflächen hinzufügen.
              </p>
            </div>
            <Button 
              onClick={handleFinish}
              className={paths.length > 0 ? "bg-solar-orange hover:bg-solar-orange/90" : "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"}
              disabled={paths.length === 0}
            >
              Weiter zur Analyse
            </Button>
          </div>

          <RoofDesigner 
            onComplete={handleRoofOutlineComplete} 
            address={address}
          />
        </div>
      </Card>

      {paths.length > 0 && (
        <Card className="p-6 bg-white/80 backdrop-blur">
          <RoofMetrics 
            monthlyProduction={metrics.monthlyProduction}
            annualSavings={metrics.annualSavings}
            roofArea={metrics.roofArea}
            possiblePanels={metrics.possiblePanels}
            kWp={metrics.kWp}
            roofDetails={metrics.roofDetails}
            onContinue={handleFinish}
          />
        </Card>
      )}
    </div>
  );
};