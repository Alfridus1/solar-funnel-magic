import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/components/configurator/types";

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Wählen Sie Ihren Speicher
      </h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              alt="Batteriespeicher"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-600 mb-4">
              Mit einem Batteriespeicher nutzen Sie Ihren Solarstrom auch nach Sonnenuntergang
            </p>
          </div>

          <div className="space-y-4">
            {batteries.map((battery) => (
              <div 
                key={battery.id} 
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  selectedBattery?.id === battery.id ? 'border-blue-600 bg-blue-50' : ''
                }`}
              >
                <div>
                  <h3 className="font-semibold">{battery.name}</h3>
                  <p className="text-sm text-gray-600">{battery.specs.capacity}kWh Kapazität</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{battery.price}€</span>
                  <Button
                    variant={selectedBattery?.id === battery.id ? "secondary" : "default"}
                    onClick={() => handleSelectBattery(battery)}
                    className={selectedBattery?.id === battery.id ? "bg-blue-200" : "bg-blue-600 hover:bg-blue-700"}
                  >
                    {selectedBattery?.id === battery.id ? "Ausgewählt" : "Auswählen"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => navigate(`/configurator/inverter?consumption=${consumption}&modules=${moduleIds.join(',')}`)}
        >
          Zurück
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Weiter zur Zusammenfassung
        </Button>
      </div>
    </div>
  );
};