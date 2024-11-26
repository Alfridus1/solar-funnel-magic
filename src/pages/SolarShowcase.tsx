import { ShowcaseContent } from "@/components/solar-showcase/components/ShowcaseContent";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function SolarShowcase() {
  const location = useLocation();
  const [metrics, setMetrics] = useState(null);
  const [address, setAddress] = useState("");
  const [products, setProducts] = useState([]);
  const [priceSettings, setPriceSettings] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const { metrics: locationMetrics, address: locationAddress } = location.state || {};
    if (locationMetrics) setMetrics(locationMetrics);
    if (locationAddress) setAddress(locationAddress);

    const loadData = async () => {
      const { data: productsData } = await supabase
        .from('solar_products')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: priceData } = await supabase
        .from('price_settings')
        .select('*')
        .single();

      if (productsData) setProducts(productsData);
      if (priceData) setPriceSettings(priceData);
    };

    loadData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, [location]);

  const handleQuoteRequest = () => {
    // Handle quote request
  };

  const handleConsultationRequest = () => {
    // Handle consultation request
  };

  return (
    <ShowcaseContent
      metrics={metrics}
      address={address}
      products={products}
      priceSettings={priceSettings}
      onQuoteRequest={handleQuoteRequest}
      onConsultationRequest={handleConsultationRequest}
      isAuthenticated={isAuthenticated}
    />
  );
}