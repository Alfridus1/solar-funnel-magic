import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Battery, Sun, Zap, ShoppingCart, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  category: 'module' | 'inverter' | 'battery';
  price: number;
  specs: {
    watts?: number;
    capacity?: number;
    power?: number;
    efficiency: number;
    warranty: number;
  };
}

interface SystemConfig {
  modules: Product[];
  inverter: Product | null;
  battery: Product | null;
}

export const SystemConfigurator = () => {
  const [yearlyConsumption, setYearlyConsumption] = useState(4000);
  const [products, setProducts] = useState<Product[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    modules: [],
    inverter: null,
    battery: null,
  });
  const [autarky, setAutarky] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    calculateAutarky();
  }, [systemConfig, yearlyConsumption]);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('solar_products')
      .select('*');
    
    if (error) {
      toast({
        title: "Fehler beim Laden der Produkte",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProducts(data);
  };

  const calculateAutarky = () => {
    const totalModulePower = systemConfig.modules.reduce((sum, module) => 
      sum + (module.specs.watts || 0), 0);
    const batteryCapacity = systemConfig.battery?.specs.capacity || 0;
    
    // Vereinfachte Berechnung der Autarkie
    // Annahme: 1kWp erzeugt ca. 1000kWh/Jahr in Deutschland
    const yearlyProduction = (totalModulePower / 1000) * 1000;
    const dailyConsumption = yearlyConsumption / 365;
    const batteryContribution = Math.min(batteryCapacity * 0.8, dailyConsumption * 0.5);
    
    const autarkyValue = Math.min(100, 
      ((yearlyProduction + (batteryContribution * 365)) / yearlyConsumption) * 100
    );
    
    setAutarky(Math.round(autarkyValue));
  };

  const addProduct = (product: Product) => {
    setSystemConfig(prev => {
      const newConfig = { ...prev };
      
      switch (product.category) {
        case 'module':
          newConfig.modules = [...prev.modules, product];
          break;
        case 'inverter':
          newConfig.inverter = product;
          break;
        case 'battery':
          newConfig.battery = product;
          break;
      }
      
      return newConfig;
    });

    toast({
      title: "Produkt hinzugefügt",
      description: `${product.name} wurde zum System hinzugefügt.`,
    });
  };

  const removeModule = (index: number) => {
    setSystemConfig(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const getTotalPrice = () => {
    const modulesPrice = systemConfig.modules.reduce((sum, module) => sum + module.price, 0);
    const inverterPrice = systemConfig.inverter?.price || 0;
    const batteryPrice = systemConfig.battery?.price || 0;
    return modulesPrice + inverterPrice + batteryPrice;
  };

  return (
    <div className="space-y-6 p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Ihr Stromverbrauch</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Zap className="h-6 w-6 text-yellow-500" />
            <Input
              type="number"
              value={yearlyConsumption}
              onChange={(e) => setYearlyConsumption(Number(e.target.value))}
              className="max-w-xs"
              placeholder="Jährlicher Verbrauch in kWh"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Verfügbare Komponenten</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {product.category === 'module' && `${product.specs.watts}W`}
                    {product.category === 'battery' && `${product.specs.capacity}kWh`}
                    {product.category === 'inverter' && `${product.specs.power}kW`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{product.price}€</span>
                  <Button
                    size="sm"
                    onClick={() => addProduct(product)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Ihre Konfiguration</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Sun className="h-5 w-5 text-yellow-500" /> Module
              </h3>
              {systemConfig.modules.map((module, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-lg mb-2">
                  <span>{module.name}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeModule(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-500" /> Wechselrichter
              </h3>
              {systemConfig.inverter ? (
                <div className="p-2 border rounded-lg">
                  {systemConfig.inverter.name}
                </div>
              ) : (
                <p className="text-gray-500">Kein Wechselrichter ausgewählt</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Battery className="h-5 w-5 text-green-500" /> Speicher
              </h3>
              {systemConfig.battery ? (
                <div className="p-2 border rounded-lg">
                  {systemConfig.battery.name}
                </div>
              ) : (
                <p className="text-gray-500">Kein Speicher ausgewählt</p>
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

            <Button className="w-full bg-green-600 hover:bg-green-700">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Angebot anfordern
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};