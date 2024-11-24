import { Card } from "@/components/ui/card";
import { RoofDesigner } from "@/components/roof/RoofDesigner";
import { RoofMetrics } from "@/components/roof/RoofMetrics";
import { ProgressBar } from "@/components/ProgressBar";

interface RoofCheckContentProps {
  address: string;
  handleRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
  paths: google.maps.LatLng[][];
  metrics: any;
  handleContinue: () => void;
  onLog?: (message: string) => void;
}

export const RoofCheckContent = ({
  address,
  handleRoofOutlineComplete,
  paths,
  metrics,
  handleContinue,
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
              <RoofMetrics {...metrics} onContinue={handleContinue} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};