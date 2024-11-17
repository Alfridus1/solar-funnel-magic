import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProgressBar } from "@/components/ProgressBar";
import type { Product } from "@/components/configurator/types";

const steps = [
  { title: "Verbrauch", description: "Ihr Stromverbrauch" },
  { title: "Module", description: "Solarmodule wählen" },
  { title: "Wechselrichter", description: "Leistung anpassen" },
  { title: "Speicher", description: "Batterie wählen" },
  { title: "Übersicht", description: "Ihre Konfiguration" },
];

export const BatteryPage = () => {
  const [searchParams] = useSearchParams();
  const consumption = Number(searchParams.get("consumption")) || 4000;
  const moduleIds = searchParams.get("modules")?.split(',') || [];
  const inverterId = searchParams.get("inverter");
  const [batteries, setBatteries] = useState<Product[]>([]);
  const [selectedBattery, setSelectedBattery] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadBatteries();
  }, []);

  const loadBatteries = async () => {
    const { data: productsData, error } = await supabase
      .from('solar_products')
      .select('*')
      .eq('category', 'battery');
    
    if (error) {
      toast({
        title: "Fehler beim Laden der Speicher",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const typedProducts = (productsData as any[]).map(product => ({
      ...product,
      category: product.category as 'battery',
      specs: product.specs as Product['specs']
    }));

    setBatteries(typedProducts);
  };

  const handleSelectBattery = (battery: Product) => {
    setSelectedBattery(battery);
    toast({
      title: "Speicher ausgewählt",
      description: `${battery.name} wurde ausgewählt.`,
    });
  };

  const handleNext = () => {
    if (!selectedBattery) {
      toast({
        title: "Bitte wählen Sie einen Speicher",
        variant: "destructive",
      });
      return;
    }
    navigate(`/configurator/summary?consumption=${consumption}&modules=${moduleIds.join(',')}&inverter=${inverterId}&battery=${selectedBattery.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProgressBar currentStep={4} totalSteps={5} steps={steps} />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Wählen Sie Ihren Speicher
          </h1>

          <Card className="p-8 shadow-lg">
            <div className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                alt="Batteriespeicher"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <p className="text-lg text-gray-600 text-center">
                Mit einem Batteriespeicher nutzen Sie Ihren Solarstrom auch nach Sonnenuntergang
              </p>
            </div>

            <div className="space-y-6">
              {batteries.map((battery) => (
                <div 
                  key={battery.id} 
                  className={`flex flex-col md:flex-row items-center justify-between p-6 border rounded-lg transition-colors ${
                    selectedBattery?.id === battery.id ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500'
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{battery.name}</h3>
                    <p className="text-gray-600">{battery.specs.capacity}kWh Kapazität</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <span className="text-2xl font-bold">{battery.price}€</span>
                    <Button
                      variant={selectedBattery?.id === battery.id ? "secondary" : "default"}
                      onClick={() => handleSelectBattery(battery)}
                      className={`px-6 ${
                        selectedBattery?.id === battery.id 
                          ? "bg-blue-200 hover:bg-blue-300" 
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {selectedBattery?.id === battery.id ? "Ausgewählt" : "Auswählen"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={() => navigate(`/configurator/inverter?consumption=${consumption}&modules=${moduleIds.join(',')}`)}
                className="px-8"
              >
                Zurück
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Weiter zur Zusammenfassung
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};