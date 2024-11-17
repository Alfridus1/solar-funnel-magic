import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/components/configurator/types";

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Wählen Sie Ihren Wechselrichter
      </h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
              alt="Wechselrichter"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-600 mb-4">
              Der Wechselrichter wandelt den Gleichstrom Ihrer Solarmodule in nutzbaren Wechselstrom um
            </p>
          </div>

          <div className="space-y-4">
            {inverters.map((inverter) => (
              <div 
                key={inverter.id} 
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  selectedInverter?.id === inverter.id ? 'border-blue-600 bg-blue-50' : ''
                }`}
              >
                <div>
                  <h3 className="font-semibold">{inverter.name}</h3>
                  <p className="text-sm text-gray-600">{inverter.specs.power}kW Leistung</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{inverter.price}€</span>
                  <Button
                    variant={selectedInverter?.id === inverter.id ? "secondary" : "default"}
                    onClick={() => handleSelectInverter(inverter)}
                    className={selectedInverter?.id === inverter.id ? "bg-blue-200" : "bg-blue-600 hover:bg-blue-700"}
                  >
                    {selectedInverter?.id === inverter.id ? "Ausgewählt" : "Auswählen"}
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
          onClick={() => navigate(`/configurator/modules?consumption=${consumption}`)}
        >
          Zurück
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Weiter zum Speicher
        </Button>
      </div>
    </div>
  );
};