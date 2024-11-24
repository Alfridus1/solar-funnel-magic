import { useLocation } from "react-router-dom";
import { SystemConfigurator } from "@/components/SystemConfigurator";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";

export const RecommendedConfig = () => {
  const location = useLocation();
  const { metrics, address } = location.state || {};

  const steps = [
    { title: "Adresse", description: "Ihre Adresse" },
    { title: "Dach vermessen", description: "Zeichnen Sie Ihr Dach" },
    { title: "Potenzialanalyse", description: "Ihre Solaranlage" },
    { title: "Unverbindliches Angebot", description: "Mit Vor-Ort Termin" }
  ];

  if (!metrics || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Fehler</h1>
            <p className="text-gray-600">
              Keine Konfigurationsdaten gefunden. Bitte starten Sie erneut mit der Dachvermessung.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <ProgressBar currentStep={3} totalSteps={4} steps={steps} />
        <div className="max-w-7xl mx-auto">
          <SystemConfigurator initialMetrics={metrics} address={address} />
        </div>
      </div>
    </div>
  );
};