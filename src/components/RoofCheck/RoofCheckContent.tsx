import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoofDesigner } from "@/components/roof/RoofDesigner";
import { RoofMetrics } from "@/components/roof/RoofMetrics";
import { ProgressBar } from "@/components/ProgressBar";
import { Plus, ArrowRight } from "lucide-react";

interface RoofCheckContentProps {
  address: string;
  handleRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
  handleViewAnalysis: () => void;
  paths: google.maps.LatLng[][];
  metrics: any;
  onLog?: (message: string) => void;
}

export const RoofCheckContent = ({
  address,
  handleRoofOutlineComplete,
  handleViewAnalysis,
  paths,
  metrics,
  onLog
}: RoofCheckContentProps) => {
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
            <div>
              <h1 className="text-2xl font-bold mb-2">Zeichnen Sie Ihr Dach ein</h1>
              <p className="text-gray-600 mb-4">
                Klicken Sie auf die Ecken Ihres Daches, um die Fläche einzuzeichnen
              </p>
            </div>

            <RoofDesigner 
              onComplete={handleRoofOutlineComplete} 
              address={address}
            />

            {paths.length > 0 && (
              <>
                <RoofMetrics {...metrics} />
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      const roofDesignerElement = document.querySelector('.roof-designer');
                      if (roofDesignerElement) {
                        roofDesignerElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Weitere Dachfläche hinzufügen
                  </Button>
                  
                  <Button 
                    className="w-full sm:w-auto bg-solar-orange hover:bg-solar-orange-600"
                    onClick={handleViewAnalysis}
                  >
                    Auswertung ansehen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};