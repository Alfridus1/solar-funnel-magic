import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ProgressBar";
import { Zap } from "lucide-react";

const steps = [
  { title: "Verbrauch", description: "Ihr Stromverbrauch" },
  { title: "Module", description: "Solarmodule wählen" },
  { title: "Wechselrichter", description: "Leistung anpassen" },
  { title: "Speicher", description: "Batterie wählen" },
  { title: "Übersicht", description: "Ihre Konfiguration" },
];

export const ConsumptionPage = () => {
  const [yearlyConsumption, setYearlyConsumption] = useState(4000);
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(`/configurator/modules?consumption=${yearlyConsumption}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProgressBar currentStep={1} totalSteps={5} steps={steps} />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Wie hoch ist Ihr jährlicher Stromverbrauch?
          </h1>
          
          <Card className="p-8 shadow-lg">
            <div className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Energieverbrauch Visualisierung"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <p className="text-lg text-gray-600 text-center">
                Geben Sie Ihren jährlichen Stromverbrauch in kWh an, um Ihre optimale Solaranlage zu konfigurieren.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <Zap className="h-8 w-8 text-yellow-500" />
                <Input
                  type="number"
                  value={yearlyConsumption}
                  onChange={(e) => setYearlyConsumption(Number(e.target.value))}
                  className="text-2xl font-semibold"
                  placeholder="Jährlicher Verbrauch in kWh"
                />
              </div>

              <Button 
                onClick={handleNext}
                className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
              >
                Weiter zur Modulauswahl
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};