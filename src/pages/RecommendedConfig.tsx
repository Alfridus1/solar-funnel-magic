import { useLocation, useNavigate } from "react-router-dom";
import { SystemConfigurator } from "@/components/SystemConfigurator";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import { loadConfigFromCookie, saveConfigToCookie } from "@/utils/configCookieManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export const RecommendedConfig = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Try to load config from location state first, then from cookie
  const configData = location.state || loadConfigFromCookie();
  const { metrics, address } = configData || {};

  useEffect(() => {
    // If we have valid config data from location state, save it to cookie
    if (location.state?.metrics && location.state?.address) {
      saveConfigToCookie(location.state);
    }

    // If no metrics are available at all, redirect to home and show message
    if (!metrics) {
      toast({
        title: "Keine Konfigurationsdaten gefunden",
        description: "Bitte starten Sie erneut mit der Dachvermessung.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [metrics, navigate, location.state, toast]);

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
              <h1 className="text-2xl font-bold">Keine Konfigurationsdaten gefunden</h1>
              <p className="text-gray-600">
                Bitte starten Sie erneut mit der Dachvermessung.
              </p>
              <Button 
                onClick={() => navigate("/")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück zur Startseite
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <ProgressBar currentStep={3} totalSteps={4} steps={steps} />
          <Card className="p-6">
            <SystemConfigurator initialMetrics={metrics} address={address} />
          </Card>
        </div>
      </div>
    </div>
  );
};