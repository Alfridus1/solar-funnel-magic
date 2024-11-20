import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Product } from "@/components/configurator/types";
import { Pencil, X } from "lucide-react";

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: "",
    category: "module",
    price: 0,
    specs: {
      watts: undefined,
      capacity: undefined,
      power: undefined,
      efficiency: undefined,
      warranty: undefined
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('solar_products')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: "Fehler beim Laden der Produkte",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProducts(data.map(product => ({
      ...product,
      category: product.category as "module" | "inverter" | "battery",
      specs: product.specs as Product['specs']
    })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('solar_products')
      .insert([newProduct]);

    if (error) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Produkt gespeichert",
      description: "Das Produkt wurde erfolgreich hinzugefügt.",
    });

    setNewProduct({
      name: "",
      category: "module",
      price: 0,
      specs: {
        watts: undefined,
        capacity: undefined,
        power: undefined,
        efficiency: undefined,
        warranty: undefined
      },
    });
    
    loadProducts();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const { error } = await supabase
      .from('solar_products')
      .update({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        specs: editingProduct.specs
      })
      .eq('id', editingProduct.id);

    if (error) {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Produkt aktualisiert",
      description: "Das Produkt wurde erfolgreich aktualisiert.",
    });

    setEditingProduct(null);
    loadProducts();
  };

  const startEditing = (product: Product) => {
    setEditingProduct(product);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Neues Produkt</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Kategorie</Label>
              <select
                id="category"
                className="w-full border rounded-md p-2"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as Product['category'] })}
                required
              >
                <option value="module">Solarmodul</option>
                <option value="inverter">Wechselrichter</option>
                <option value="battery">Speicher</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="price">Preis</Label>
              <Input
                id="price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                required
              />
            </div>

            <Button type="submit">Produkt hinzufügen</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Produktliste</h3>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                {editingProduct?.id === product.id ? (
                  <form onSubmit={handleEdit} className="w-full space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          required
                        />
                      </div>
                      <select
                        className="border rounded-md p-2"
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Product['category'] })}
                        required
                      >
                        <option value="module">Solarmodul</option>
                        <option value="inverter">Wechselrichter</option>
                        <option value="battery">Speicher</option>
                      </select>
                      <Input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        required
                        className="w-24"
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">Speichern</Button>
                        <Button type="button" size="sm" variant="outline" onClick={cancelEditing}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">{product.price}€</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(product)}
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
      </div>
    </div>
  );
};