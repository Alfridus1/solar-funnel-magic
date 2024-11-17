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

export const InverterPage = () => {
  const [searchParams] = useSearchParams();
  const consumption = Number(searchParams.get("consumption")) || 4000;
  const moduleIds = searchParams.get("modules")?.split(',') || [];
  const [inverters, setInverters] = useState<Product[]>([]);
  const [selectedInverter, setSelectedInverter] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadInverters();
  }, []);

  const loadInverters = async () => {
    const { data: productsData, error } = await supabase
      .from('solar_products')
      .select('*')
      .eq('category', 'inverter');
    
    if (error) {
      toast({
        title: "Fehler beim Laden der Wechselrichter",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const typedProducts = (productsData as any[]).map(product => ({
      ...product,
      category: product.category as 'inverter',
      specs: product.specs as Product['specs']
    }));

    setInverters(typedProducts);
  };

  const handleSelectInverter = (inverter: Product) => {
    setSelectedInverter(inverter);
    toast({
      title: "Wechselrichter ausgewählt",
      description: `${inverter.name} wurde ausgewählt.`,
    });
  };

  const handleNext = () => {
    if (!selectedInverter) {
      toast({
        title: "Bitte wählen Sie einen Wechselrichter",
        variant: "destructive",
      });
      return;
    }
    navigate(`/configurator/battery?consumption=${consumption}&modules=${moduleIds.join(',')}&inverter=${selectedInverter.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProgressBar currentStep={3} totalSteps={5} steps={steps} />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Wählen Sie Ihren Wechselrichter
          </h1>

          <Card className="p-8 shadow-lg">
            <div className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                alt="Wechselrichter"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <p className="text-lg text-gray-600 text-center">
                Der Wechselrichter wandelt den Gleichstrom Ihrer Solarmodule in nutzbaren Wechselstrom um
              </p>
            </div>

            <div className="space-y-6">
              {inverters.map((inverter) => (
                <div 
                  key={inverter.id} 
                  className={`flex flex-col md:flex-row items-center justify-between p-6 border rounded-lg transition-colors ${
                    selectedInverter?.id === inverter.id ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500'
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{inverter.name}</h3>
                    <p className="text-gray-600">{inverter.specs.power}kW Leistung</p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <span className="text-2xl font-bold">{inverter.price}€</span>
                    <Button
                      variant={selectedInverter?.id === inverter.id ? "secondary" : "default"}
                      onClick={() => handleSelectInverter(inverter)}
                      className={`px-6 ${
                        selectedInverter?.id === inverter.id 
                          ? "bg-blue-200 hover:bg-blue-300" 
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {selectedInverter?.id === inverter.id ? "Ausgewählt" : "Auswählen"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={() => navigate(`/configurator/modules?consumption=${consumption}`)}
                className="px-8"
              >
                Zurück
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Weiter zum Speicher
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};