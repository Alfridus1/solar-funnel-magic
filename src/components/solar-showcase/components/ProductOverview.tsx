import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/configurator/types";

export const ProductOverview = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('solar_products')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error loading products:', error);
      return;
    }

    setProducts(data || []);
  };

  const defaultProducts = [
    {
      title: "500W Full Black Module",
      description: "Hocheffiziente Module mit 30 Jahren Garantie",
      image: "/lovable-uploads/fe437c08-df76-4ced-92d4-e82b0a6afe5c.png",
      specs: ["500W Nennleistung", "21% Wirkungsgrad", "30 Jahre Garantie"],
      datasheet: "/path/to/module-datasheet.pdf"
    },
    {
      title: "Smart Wechselrichter",
      description: "Intelligente Steuerung Ihrer Solaranlage",
      image: "/lovable-uploads/f2d1edec-2b0f-4af0-9ec8-9e7caf7a8ea7.png",
      specs: ["98.6% Wirkungsgrad", "Integriertes Monitoring", "Smart-Home ready"],
      datasheet: "/path/to/inverter-datasheet.pdf"
    },
    {
      title: "Hochleistungsspeicher",
      description: "Maximale Unabhängigkeit durch effiziente Speicherung",
      image: "/lovable-uploads/2b67e439-3bd1-4ad6-8498-ee34e8f6d45f.png",
      specs: ["15kWh Kapazität", "95% Entladetiefe", "10 Jahre Garantie"],
      datasheet: "/path/to/battery-datasheet.pdf"
    }
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Unsere Premium Produkte
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {defaultProducts.map((product, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-solar-blue-50 to-white p-6">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">{product.title}</h3>
              <p className="text-gray-600">{product.description}</p>
              <ul className="space-y-2">
                {product.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-solar-orange" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-solar-orange hover:bg-solar-orange-dark"
                >
                  Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {product.datasheet && (
                  <Button 
                    variant="outline"
                    onClick={() => window.open(product.datasheet, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};