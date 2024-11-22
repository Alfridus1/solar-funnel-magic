import { useEffect, useState } from "react";
import { Leaf, Zap, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";

interface PremiumProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  climate_impact: string;
  purchase_options: {
    price: number;
    financing: {
      available: boolean;
      min_rate: number;
      max_term: number;
    };
  };
}

interface SupabaseProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  climate_impact: string;
  order_number: number;
  purchase_options?: {
    price: number;
    financing: {
      available: boolean;
      min_rate: number;
      max_term: number;
    };
  };
}

export const PremiumProductsCarousel = () => {
  const [products, setProducts] = useState<PremiumProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // First, let's insert our new products if they don't exist
      const newProducts = [
        {
          name: "Smart Wallbox Pro",
          description: "Intelligente Ladestation für Ihr Elektrofahrzeug mit bidirektionalem Laden",
          image_url: "/wallbox-image.png", // You'll need to add this image
          features: [
            "22 kW Ladeleistung",
            "Bidirektionales Laden",
            "Smart Home Integration",
            "Dynamisches Lastmanagement",
            "RFID Zugangskontrolle"
          ],
          climate_impact: "Reduziert CO2-Emissionen durch intelligentes Laden",
          order_number: 4,
          purchase_options: {
            price: 1299,
            financing: {
              available: true,
              min_rate: 2.99,
              max_term: 48
            }
          }
        },
        {
          name: "Coppen Connect",
          description: "Smart Home System für maximale Energieeffizienz",
          image_url: "/smart-home-image.png", // You'll need to add this image
          features: [
            "Intelligente Energiesteuerung",
            "PV-Optimierung",
            "Wärmepumpen-Integration",
            "Mobile App Steuerung",
            "Automatisierte Szenarien"
          ],
          climate_impact: "Optimiert Energieverbrauch und reduziert CO2-Fußabdruck",
          order_number: 5,
          purchase_options: {
            price: 799,
            financing: {
              available: true,
              min_rate: 0,
              max_term: 24
            }
          }
        }
      ];

      for (const product of newProducts) {
        const { data: existingProduct } = await supabase
          .from('premium_products')
          .select('id')
          .eq('name', product.name)
          .single();

        if (!existingProduct) {
          await supabase
            .from('premium_products')
            .insert([product]);
        }
      }

      // Then fetch all products
      const { data, error } = await supabase
        .from('premium_products')
        .select('*')
        .order('order_number');
      
      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      const transformedData: PremiumProduct[] = (data as SupabaseProduct[]).map(item => ({
        ...item,
        purchase_options: item.purchase_options || {
          price: 0,
          financing: {
            available: false,
            min_rate: 0,
            max_term: 0
          }
        }
      }));

      setProducts(transformedData);
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-12">
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow m-2">
                <div className="aspect-square bg-gradient-to-br from-solar-blue-50 to-white p-8">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-700 flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      {product.climate_impact}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-solar-orange" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {product.purchase_options && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-2xl font-bold text-solar-orange">
                        {product.purchase_options.price.toLocaleString()}€
                      </p>
                      {product.purchase_options.financing.available && (
                        <p className="text-sm text-gray-600">
                          Finanzierung ab {product.purchase_options.financing.min_rate}% für bis zu {product.purchase_options.financing.max_term} Monate
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};