import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/components/configurator/types";

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Wählen Sie Ihre Solarmodule
      </h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276"
              alt="Solarmodule"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-600 mb-4">
              Unsere hochwertigen 599W Module bieten maximale Effizienz für Ihr Dach
            </p>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{module.name}</h3>
                  <p className="text-sm text-gray-600">599W Leistung</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{module.price}€</span>
                  <Button
                    onClick={() => handleAddModule(module)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Hinzufügen
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Ausgewählte Module:</h3>
            {selectedModules.map((module, index) => (
              <div key={index} className="text-sm text-gray-600">
                {module.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => navigate("/configurator/consumption")}
        >
          Zurück
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Weiter zum Wechselrichter
        </Button>
      </div>
    </div>
  );
};