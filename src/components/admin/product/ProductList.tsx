import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Product } from "@/components/configurator/types";
import { Pencil, X } from "lucide-react";

interface ProductListProps {
  products: Product[];
  editingProduct: Product | null;
  onStartEditing: (product: Product) => void;
  onCancelEditing: () => void;
  onSaveEdit: (e: React.FormEvent) => void;
  onEditingProductChange: (product: Product) => void;
}

export const ProductList = ({
  products,
  editingProduct,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onEditingProductChange,
}: ProductListProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Produktliste</h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            {editingProduct?.id === product.id ? (
              <form onSubmit={onSaveEdit} className="w-full space-y-4">
                <div className="flex items-center gap-4">
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      value={editingProduct.name}
                      onChange={(e) => onEditingProductChange({ ...editingProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <select
                    className="border rounded-md p-2"
                    value={editingProduct.category}
                    onChange={(e) => onEditingProductChange({ ...editingProduct, category: e.target.value as Product['category'] })}
                    required
                  >
                    <option value="module">Solarmodul</option>
                    <option value="inverter">Wechselrichter</option>
                    <option value="battery">Speicher</option>
                  </select>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => onEditingProductChange({ ...editingProduct, price: Number(e.target.value) })}
                    required
                    className="w-24"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">Speichern</Button>
                    <Button type="button" size="sm" variant="outline" onClick={onCancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded-md"
                    />
                  )}
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">{product.price}€</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStartEditing(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};