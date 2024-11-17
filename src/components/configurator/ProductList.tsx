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
                onClick={() => onAddProduct(product)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};