import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/components/configurator/types";

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Ihre Konfiguration
      </h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1497440001374-f26997328c1b"
              alt="Solaranlage"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Module:</h3>
              {modules.map((module, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {module.name} - {module.specs.watts}W
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Wechselrichter:</h3>
              {inverter ? (
                <div className="text-sm text-gray-600">
                  {inverter.name} - {inverter.specs.power}kW
                </div>
              ) : (
                <p className="text-sm text-gray-500">Kein Wechselrichter ausgewählt</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Speicher:</h3>
              {battery ? (
                <div className="text-sm text-gray-600">
                  {battery.name} - {battery.specs.capacity}kWh
                </div>
              ) : (
                <p className="text-sm text-gray-500">Kein Speicher ausgewählt</p>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Autarkiegrad:</span>
                <span className="text-2xl font-bold text-blue-600">{autarky}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Gesamtpreis:</span>
                <span className="text-2xl font-bold text-green-600">{getTotalPrice()}€</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => navigate(`/configurator/battery?consumption=${consumption}&modules=${moduleIds.join(',')}&inverter=${inverterId}`)}
        >
          Zurück
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
        >
          Angebot anfordern
        </Button>
      </div>
    </div>
  );
};