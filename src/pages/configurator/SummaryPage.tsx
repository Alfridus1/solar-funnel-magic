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

export const SummaryPage = () => {
  const [searchParams] = useSearchParams();
  const consumption = Number(searchParams.get("consumption")) || 4000;
  const moduleIds = searchParams.get("modules")?.split(',') || [];
  const inverterId = searchParams.get("inverter");
  const batteryId = searchParams.get("battery");
  
  const [modules, setModules] = useState<Product[]>([]);
  const [inverter, setInverter] = useState<Product | null>(null);
  const [battery, setBattery] = useState<Product | null>(null);
  const [autarky, setAutarky] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    calculateAutarky();
  }, [modules, battery, consumption]);

  const loadProducts = async () => {
    // Load modules
    if (moduleIds.length > 0) {
      const { data: modulesData, error: modulesError } = await supabase
        .from('solar_products')
        .select('*')
        .in('id', moduleIds);
      
      if (modulesError) {
        toast({
          title: "Fehler beim Laden der Module",
          description: modulesError.message,
          variant: "destructive",
        });
      } else {
        setModules(modulesData as Product[]);
      }
    }

    // Load inverter
    if (inverterId) {
      const { data: inverterData, error: inverterError } = await supabase
        .from('solar_products')
        .select('*')
        .eq('id', inverterId)
        .single();
      
      if (inverterError) {
        toast({
          title: "Fehler beim Laden des Wechselrichters",
          description: inverterError.message,
          variant: "destructive",
        });
      } else {
        setInverter(inverterData as Product);
      }
    }

    // Load battery
    if (batteryId) {
      const { data: batteryData, error: batteryError } = await supabase
        .from('solar_products')
        .select('*')
        .eq('id', batteryId)
        .single();
      
      if (batteryError) {
        toast({
          title: "Fehler beim Laden des Speichers",
          description: batteryError.message,
          variant: "destructive",
        });
      } else {
        setBattery(batteryData as Product);
      }
    }
  };

  const calculateAutarky = () => {
    const totalModulePower = modules.reduce((sum, module) => 
      sum + (module.specs.watts || 0), 0);
    const batteryCapacity = battery?.specs.capacity || 0;
    
    const yearlyProduction = (totalModulePower / 1000) * 1000;
    const dailyConsumption = consumption / 365;
    const batteryContribution = Math.min(batteryCapacity * 0.8, dailyConsumption * 0.5);
    
    const autarkyValue = Math.min(100, 
      ((yearlyProduction + (batteryContribution * 365)) / consumption) * 100
    );
    
    setAutarky(Math.round(autarkyValue));
  };

  const getTotalPrice = () => {
    const modulesPrice = modules.reduce((sum, module) => sum + module.price, 0);
    const inverterPrice = inverter?.price || 0;
    const batteryPrice = battery?.price || 0;
    return modulesPrice + inverterPrice + batteryPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProgressBar currentStep={5} totalSteps={5} steps={steps} />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Ihre Konfiguration
          </h1>

          <Card className="p-8 shadow-lg">
            <div className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1497440001374-f26997328c1b"
                alt="Solaranlage"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Module:</h3>
                    {modules.map((module, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg mb-2">
                        <div className="font-medium">{module.name}</div>
                        <div className="text-sm text-gray-600">
                          {module.specs.watts}W - {module.price}€
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Wechselrichter:</h3>
                    {inverter ? (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium">{inverter.name}</div>
                        <div className="text-sm text-gray-600">
                          {inverter.specs.power}kW - {inverter.price}€
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Kein Wechselrichter ausgewählt</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Speicher:</h3>
                    {battery ? (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium">{battery.name}</div>
                        <div className="text-sm text-gray-600">
                          {battery.specs.capacity}kWh - {battery.price}€
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Kein Speicher ausgewählt</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Autarkiegrad</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-blue-600">{autarky}%</div>
                      <div className="text-sm text-gray-600">
                        Ihrer Stromversorgung wird durch die Solaranlage gedeckt
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-green-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Gesamtpreis</h3>
                    <div className="text-4xl font-bold text-green-600">
                      {getTotalPrice()}€
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/configurator/battery?consumption=${consumption}&modules=${moduleIds.join(',')}&inverter=${inverterId}`)}
                  className="px-8"
                >
                  Zurück
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 px-8"
                >
                  Angebot anfordern
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};