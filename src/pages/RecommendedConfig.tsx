import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ConfigurationSummary } from "@/components/configurator/ConfigurationSummary";
import { ConsumptionInput } from "@/components/configurator/ConsumptionInput";
import { Extras } from "@/components/configurator/Extras";
import { ProductList } from "@/components/configurator/ProductList";
import { SystemSummary } from "@/components/configurator/SystemSummary";
import { loadConfigFromCookie } from "@/utils/configCookieManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Product, SystemConfig } from "@/components/configurator/types";

export const RecommendedConfig = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [yearlyConsumption, setYearlyConsumption] = useState(3500);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    modules: [],
    inverter: null,
    battery: null,
  });
  const { toast } = useToast();
  
  const { metrics, address } = location.state || loadConfigFromCookie() || {};

  useEffect(() => {
    if (!metrics || !address) {
      navigate("/");
      return;
    }
  }, [metrics, address, navigate]);

  if (!metrics || !address) {
    return null;
  }

  const handleConsumptionChange = (value: number) => {
    setYearlyConsumption(value);
  };

  const handleAddProduct = (product: Product) => {
    setSystemConfig(prev => {
      if (product.category === 'module') {
        return {
          ...prev,
          modules: [...prev.modules, product]
        };
      } else if (product.category === 'inverter') {
        return {
          ...prev,
          inverter: product
        };
      } else if (product.category === 'battery') {
        return {
          ...prev,
          battery: product
        };
      }
      return prev;
    });
  };

  const handleRemoveModule = (index: number) => {
    setSystemConfig(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const getTotalPrice = () => {
    const modulePrice = systemConfig.modules.reduce((sum, module) => sum + module.price, 0);
    const inverterPrice = systemConfig.inverter?.price || 0;
    const batteryPrice = systemConfig.battery?.price || 0;
    return modulePrice + inverterPrice + batteryPrice;
  };

  // Calculate autarky based on system configuration and consumption
  const calculateAutarky = () => {
    const totalProduction = metrics.monthlyProduction * 12;
    return Math.min(100, Math.round((totalProduction / yearlyConsumption) * 100)) || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ConfigurationSummary metrics={metrics} address={address} />
            <ConsumptionInput
              yearlyConsumption={yearlyConsumption}
              onChange={handleConsumptionChange}
            />
            <ProductList
              products={[
                // Example products - replace with actual products from your database
                {
                  id: '1',
                  name: 'Solar Module 400W',
                  category: 'module',
                  price: 250,
                  specs: { watts: 400 },
                  image_url: '/placeholder.svg'
                },
                {
                  id: '2',
                  name: 'Inverter 5kW',
                  category: 'inverter',
                  price: 1500,
                  specs: { power: 5 },
                  image_url: '/placeholder.svg'
                },
                {
                  id: '3',
                  name: 'Battery 10kWh',
                  category: 'battery',
                  price: 5000,
                  specs: { capacity: 10 },
                  image_url: '/placeholder.svg'
                }
              ]}
              onAddProduct={handleAddProduct}
            />
            <Extras />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SystemSummary
                systemConfig={systemConfig}
                autarky={calculateAutarky()}
                onRemoveModule={handleRemoveModule}
                getTotalPrice={getTotalPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};