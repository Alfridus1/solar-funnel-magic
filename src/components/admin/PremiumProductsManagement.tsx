import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, X, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PremiumProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  climate_impact: string;
  order_number: number;
}

interface ProductFormData {
  name: string;
  description: string;
  image_url: string;
  climate_impact: string;
  features: string;
}

export const PremiumProductsManagement = () => {
  const [products, setProducts] = useState<PremiumProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PremiumProduct | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue } = useForm<ProductFormData>();

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('premium_products')
      .select('*')
      .order('order_number');
    
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

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setValue("name", editingProduct.name);
      setValue("description", editingProduct.description);
      setValue("image_url", editingProduct.image_url);
      setValue("climate_impact", editingProduct.climate_impact);
      setValue("features", editingProduct.features.join('\n'));
    }
  }, [editingProduct, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    const features = data.features.split('\n').filter(f => f.trim());
    
    const operation = editingProduct 
      ? supabase
          .from('premium_products')
          .update({ ...data, features })
          .eq('id', editingProduct.id)
      : supabase
          .from('premium_products')
          .insert([{
            ...data,
            features,
            order_number: products.length + 1,
          }]);

    const { error } = await operation;

    if (error) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Produkt gespeichert",
        description: editingProduct 
          ? "Das Premium-Produkt wurde erfolgreich aktualisiert."
          : "Das Premium-Produkt wurde erfolgreich hinzugefügt.",
      });
      reset();
      setEditingProduct(null);
      loadProducts();
    }
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('premium_products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Produkt gelöscht",
        description: "Das Premium-Produkt wurde erfolgreich gelöscht.",
      });
      loadProducts();
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    reset();
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editingProduct ? "Premium-Produkt bearbeiten" : "Premium-Produkte verwalten"}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register("name")} placeholder="Produktname" />
          </div>
          <div>
            <Textarea {...register("description")} placeholder="Beschreibung" />
          </div>
          <div>
            <Input {...register("image_url")} placeholder="Bild-URL" />
          </div>
          <div>
            <Input {...register("climate_impact")} placeholder="Klima-Effekt" />
          </div>
          <div>
            <Textarea 
              {...register("features")} 
              placeholder="Features (ein Feature pro Zeile)" 
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingProduct ? (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Produkt aktualisieren
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Produkt hinzufügen
                </>
              )}
            </Button>
            {editingProduct && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Abbrechen
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">{product.name}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingProduct(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteProduct(product.id)}
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
            <ul className="text-sm space-y-1">
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};