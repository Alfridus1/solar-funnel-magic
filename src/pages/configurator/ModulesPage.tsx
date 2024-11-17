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

export const ModulesPage = () => {
  const [searchParams] = useSearchParams();
  const consumption = Number(searchParams.get("consumption")) || 4000;
  const [modules, setModules] = useState<Product[]>([]);
  const [selectedModules, setSelectedModules] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    const { data: productsData, error } = await supabase
      .from('solar_products')
      .select('*')
      .eq('category', 'module')
      .eq('specs->watts', 599);
    
    if (error) {
      toast({
        title: "Fehler beim Laden der Module",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const typedProducts = (productsData as any[]).map(product => ({
      ...product,
      category: product.category as 'module',
      specs: product.specs as Product['specs']
    }));

    setModules(typedProducts);
  };

  const handleAddModule = (module: Product) => {
    setSelectedModules([...selectedModules, module]);
    toast({
      title: "Modul hinzugefügt",
      description: `${module.name} wurde zum System hinzugefügt.`,
    });
  };

  const handleNext = () => {
    if (selectedModules.length === 0) {
      toast({
        title: "Bitte wählen Sie mindestens ein Modul",
        variant: "destructive",
      });
      return;
    }
    const moduleIds = selectedModules.map(m => m.id).join(',');
    navigate(`/configurator/inverter?consumption=${consumption}&modules=${moduleIds}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProgressBar currentStep={2} totalSteps={5} steps={steps} />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Wählen Sie Ihre Solarmodule
          </h1>

          <Card className="p-8 shadow-lg">
            <div className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276"
                alt="Solarmodule"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <p className="text-lg text-gray-600 text-center mb-8">
                Unsere hochwertigen 599W Module bieten maximale Effizienz für Ihr Dach
              </p>
            </div>

            <div className="space-y-6">
              {modules.map((module) => (
                <div 
                  key={module.id} 
                  className="flex flex-col md:flex-row items-center justify-between p-6 border rounded-lg hover:border-blue-500 transition-colors"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
                    <p className="text-gray-600">599W Leistung</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <span className="text-2xl font-bold">{module.price}€</span>
                    <Button
                      onClick={() => handleAddModule(module)}
                      className="bg-blue-600 hover:bg-blue-700 px-6"
                    >
                      Hinzufügen
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {selectedModules.length > 0 && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Ausgewählte Module:</h3>
                <div className="space-y-2">
                  {selectedModules.map((module, index) => (
                    <div key={index} className="text-gray-600">
                      {module.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={() => navigate("/configurator/consumption")}
                className="px-8"
              >
                Zurück
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Weiter zum Wechselrichter
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};