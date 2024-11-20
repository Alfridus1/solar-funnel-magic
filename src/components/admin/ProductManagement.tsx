import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Product } from "@/components/configurator/types";

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "module",
    price: 0,
    specs: {},
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

    setProducts(data);
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
      specs: {},
    });
    
    loadProducts();
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
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
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
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <p className="font-semibold">{product.price}€</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};