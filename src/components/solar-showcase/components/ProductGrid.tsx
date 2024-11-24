import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/components/configurator/types";

interface ProductGridProps {
  products: Product[];
  onConsultationRequest: () => void;
}

export const ProductGrid = ({ products, onConsultationRequest }: ProductGridProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-gradient-to-br from-solar-blue-50 to-white p-6">
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <div className="text-sm text-gray-600">
              {product.category === 'module' && product.specs.watts && `${product.specs.watts}W`}
              {product.category === 'battery' && product.specs.capacity && `${product.specs.capacity}kWh`}
              {product.category === 'inverter' && product.specs.power && `${product.specs.power}kW`}
            </div>
            <div className="font-semibold">{product.price}€</div>
            <Button 
              className="w-full bg-solar-orange hover:bg-solar-orange-dark"
              onClick={onConsultationRequest}
            >
              Beratung anfragen
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};