import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { RoofMetrics } from "@/components/roof/RoofMetrics";
import { loadConfigFromCookie } from "@/utils/configCookieManager";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const RoofAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { metrics, address } = location.state || loadConfigFromCookie() || {};

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
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Keine Analysedaten gefunden</h1>
              <p className="text-gray-600">
                Bitte starten Sie erneut mit der Dachvermessung.
              </p>
              <Button 
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    navigate("/recommended-config", {
      state: {
        metrics,
        address,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <ProgressBar currentStep={2} totalSteps={4} steps={steps} />
        
        <Card className="max-w-5xl mx-auto p-6 mt-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Ihre Dachanalyse</h1>
              <p className="text-gray-600">
                Basierend auf Ihrer Dachfläche haben wir folgende Werte berechnet:
              </p>
            </div>

            <RoofMetrics {...metrics} onContinue={handleContinue} />

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück
              </Button>
              <Button
                onClick={handleContinue}
                className="flex items-center gap-2"
              >
                Weiter zur Konfiguration
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};