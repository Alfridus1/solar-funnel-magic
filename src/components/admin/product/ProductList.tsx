import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Product } from "@/components/configurator/types";
import { Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingProduct) return;
    
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(fileName);

      if (!publicUrl) throw new Error('Failed to get public URL');

      // Update the product with the new image URL
      onEditingProductChange({
        ...editingProduct,
        image_url: publicUrl
      });

      toast({
        title: "Bild hochgeladen",
        description: "Das Produktbild wurde erfolgreich aktualisiert.",
      });
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast({
        title: "Fehler beim Hochladen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
                  <div className="relative w-16 h-16 group">
                    <img 
                      src={editingProduct.image_url || '/placeholder.svg'} 
                      alt={editingProduct.name}
                      className="w-16 h-16 object-contain rounded-md"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                      <span className="text-white text-xs">Klicken zum Ändern</span>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
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
                  <img 
                    src={product.image_url || '/placeholder.svg'} 
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded-md"
                  />
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