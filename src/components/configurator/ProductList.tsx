import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "./types";

interface ProductListProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export const ProductList = ({ products, onAddProduct }: ProductListProps) => {
  return (
    <Card className="p-4 sm:p-6 w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Verfügbare Komponenten</h2>
      <div className="space-y-3 sm:space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
            <div className="flex items-center gap-2 sm:gap-4">
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-md"
                />
              )}
              <div>
                <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {product.category === 'module' && `${product.specs.watts}W`}
                  {product.category === 'battery' && `${product.specs.capacity}kWh`}
                  {product.category === 'inverter' && `${product.specs.power}kW`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="font-semibold text-sm sm:text-base whitespace-nowrap">{product.price}€</span>
              <Button
                size="sm"
                onClick={() => onAddProduct(product)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};