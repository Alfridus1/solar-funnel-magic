import { Card } from "@/components/ui/card";
import { RoofDesigner } from "@/components/roof/RoofDesigner";
import { RoofMetrics } from "@/components/roof/RoofMetrics";
import { ProgressBar } from "@/components/ProgressBar";
import { useNavigate } from "react-router-dom";

interface RoofCheckContentProps {
  address: string;
  handleRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => void;
  paths: google.maps.LatLng[][];
  metrics: any;
  onLog?: (message: string) => void;
}

export const RoofCheckContent = ({
  address,
  handleRoofOutlineComplete,
  paths,
  metrics,
  onLog
}: RoofCheckContentProps) => {
  const navigate = useNavigate();
  const steps = [
    { title: "Adresse", description: "Ihre Adresse" },
    { title: "Dach vermessen", description: "Zeichnen Sie Ihr Dach" },
    { title: "Potenzialanalyse", description: "Ihre Solaranlage" },
    { title: "Unverbindliches Angebot", description: "Mit Vor-Ort Termin" }
  ];

  const handleComplete = (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => {
    handleRoofOutlineComplete(paths, roofDetails);
    // Navigate to ProductShowcase with metrics and address
    navigate('/solar-showcase', { state: { metrics, address } });
  };

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
              onComplete={handleComplete} 
              address={address}
            />

            {paths.length > 0 && (
              <RoofMetrics {...metrics} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};