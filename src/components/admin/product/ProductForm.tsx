import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Product } from "@/components/configurator/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ProductFormProps {
  onProductAdded: () => void;
}

export const ProductForm = ({ onProductAdded }: ProductFormProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
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
    image_url: undefined
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;

    setUploading(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      setNewProduct(prev => ({
        ...prev,
        image_url: publicUrl
      }));

      toast({
        title: "Bild hochgeladen",
        description: "Das Produktbild wurde erfolgreich hochgeladen.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Hochladen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
      image_url: undefined
    });
    
    onProductAdded();
  };

  return (
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

        <div>
          <Label htmlFor="image">Produktbild</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </div>

        <Button type="submit" disabled={uploading}>
          {uploading ? "Lädt hoch..." : "Produkt hinzufügen"}
        </Button>
      </form>
    </Card>
  );
};