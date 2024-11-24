import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoofDesigner } from "@/components/roof/RoofDesigner";
import { RoofMetrics } from "@/components/roof/RoofMetrics";
import { ProgressBar } from "@/components/ProgressBar";

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
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);

  const steps = [
    { title: "Adresse", description: "Ihre Adresse" },
    { title: "Dach vermessen", description: "Zeichnen Sie Ihr Dach" },
    { title: "Potenzialanalyse", description: "Ihre Solaranlage" },
    { title: "Unverbindliches Angebot", description: "Mit Vor-Ort Termin" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <ProgressBar currentStep={2} totalSteps={4} steps={steps} />
        
        <Card className="max-w-5xl mx-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold mb-2">Zeichnen Sie Ihr Dach ein</h1>
              <div className="flex gap-4">
                <Button 
                  onClick={() => setIsDrawingEnabled(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isDrawingEnabled}
                >
                  Dach einzeichnen
                </Button>
                {paths.length > 0 && (
                  <Button 
                    onClick={handleFinish}
                    className="bg-solar-orange hover:bg-solar-orange/90"
                  >
                    Weiter zur Analyse
                  </Button>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Klicken Sie auf die Ecken Ihres Daches, um die Fläche einzuzeichnen. Sie können mehrere Dachflächen hinzufügen.
            </p>

            {isDrawingEnabled && (
              <RoofDesigner 
                onComplete={handleRoofOutlineComplete} 
                address={address}
              />
            )}

            {paths.length > 0 && (
              <RoofMetrics {...metrics} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};