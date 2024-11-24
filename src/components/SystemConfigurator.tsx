import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConsumptionInput } from "./configurator/ConsumptionInput";
import { ProductList } from "./configurator/ProductList";
import { SystemSummary } from "./configurator/SystemSummary";
import { ConfigurationSummary } from "./configurator/ConfigurationSummary";
import type { Product, SystemConfig } from "./configurator/types";

interface SystemConfiguratorProps {
  initialMetrics?: {
    monthlyProduction: number;
    annualSavings: number;
    roofArea: number;
    possiblePanels: number;
    kWp: number;
  };
  address?: string;
}

export const SystemConfigurator = ({ initialMetrics, address }: SystemConfiguratorProps) => {
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
    if (initialMetrics) {
      const estimatedConsumption = Math.round(initialMetrics.monthlyProduction * 12);
      setYearlyConsumption(estimatedConsumption);
    }
  }, [initialMetrics]);

  const loadProducts = async () => {
    const { data: productsData, error } = await supabase
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

    const typedProducts = (productsData as any[]).map(product => ({
      ...product,
      category: product.category as 'module' | 'inverter' | 'battery',
      specs: product.specs as Product['specs']
    }));

    setProducts(typedProducts);
  };

  const calculateAutarky = () => {
    const totalKWp = systemConfig.modules.reduce((sum, module) => 
      sum + ((module.specs.watts || 0) / 1000), 0);
    
    const yearlyProduction = totalKWp * 950;
    const dailyConsumption = yearlyConsumption / 365;
    const batteryCapacity = systemConfig.battery?.specs.capacity || 0;
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

    // Recalculate autarky whenever a product is added
    setTimeout(calculateAutarky, 0);
  };

  const removeModule = (index: number) => {
    setSystemConfig(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
    // Recalculate autarky whenever a module is removed
    setTimeout(calculateAutarky, 0);
  };

  const getTotalPrice = () => {
    const modulesPrice = systemConfig.modules.reduce((sum, module) => sum + module.price, 0);
    const inverterPrice = systemConfig.inverter?.price || 0;
    const batteryPrice = systemConfig.battery?.price || 0;
    return modulesPrice + inverterPrice + batteryPrice;
  };

  return (
    <div className="space-y-6">
      {initialMetrics && address && (
        <ConfigurationSummary metrics={initialMetrics} address={address} />
      )}
      
      <ConsumptionInput 
        yearlyConsumption={yearlyConsumption}
        onChange={setYearlyConsumption}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductList 
          products={products}
          onAddProduct={addProduct}
        />
        <SystemSummary 
          systemConfig={systemConfig}
          autarky={autarky}
          onRemoveModule={removeModule}
          getTotalPrice={getTotalPrice}
        />
      </div>
    </div>
  );
};