import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";

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

interface PremiumProductListProps {
  products: PremiumProduct[];
  onEdit: (product: PremiumProduct) => void;
  onDelete: (id: string) => void;
}

export const PremiumProductList = ({ products, onEdit, onDelete }: PremiumProductListProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold">{product.name}</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(product)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(product.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-48 object-contain mb-4"
          />
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
          <p className="text-sm text-green-600 mb-2">{product.climate_impact}</p>
          <div className="mb-4">
            <p className="font-semibold">{product.purchase_options.price.toLocaleString()}€</p>
            {product.purchase_options.financing.available && (
              <p className="text-sm text-gray-600">
                Finanzierung ab {product.purchase_options.financing.min_rate}% 
                für bis zu {product.purchase_options.financing.max_term} Monate
              </p>
            )}
          </div>
          <ul className="text-sm space-y-1">
            {product.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
};