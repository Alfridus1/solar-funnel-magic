import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PremiumProductForm } from "./product/PremiumProductForm";
import { PremiumProductList } from "./product/PremiumProductList";
import { PremiumProduct, PremiumProductFormFields } from "./product/types";

export const PremiumProductsManagement = () => {
  const [products, setProducts] = useState<PremiumProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PremiumProduct | null>(null);
  const { toast } = useToast();

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

    // Transform the data to ensure it matches the PremiumProduct type
    const transformedData: PremiumProduct[] = data?.map(item => ({
      ...item,
      purchase_options: typeof item.purchase_options === 'string' 
        ? JSON.parse(item.purchase_options)
        : item.purchase_options
    })) || [];

    setProducts(transformedData);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onSubmit = async (data: PremiumProductFormFields) => {
    setLoading(true);
    const features = data.features.split('\n').filter((f: string) => f.trim());
    
    const purchase_options = {
      price: data.price,
      financing: {
        available: data.financing_available,
        min_rate: data.financing_min_rate,
        max_term: data.financing_max_term
      }
    };
    
    const operation = editingProduct 
      ? supabase
          .from('premium_products')
          .update({ 
            name: data.name,
            description: data.description,
            image_url: data.image_url,
            climate_impact: data.climate_impact,
            features,
            purchase_options
          })
          .eq('id', editingProduct.id)
      : supabase
          .from('premium_products')
          .insert([{
            name: data.name,
            description: data.description,
            image_url: data.image_url,
            climate_impact: data.climate_impact,
            features,
            purchase_options,
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

  const handleEditProduct = (product: PremiumProduct) => {
    setEditingProduct(product);
  };

  return (
    <div className="space-y-8">
      <PremiumProductForm
        editingProduct={editingProduct}
        loading={loading}
        onSubmit={onSubmit}
        onCancel={() => setEditingProduct(null)}
      />
      <PremiumProductList
        products={products}
        onEdit={handleEditProduct}
        onDelete={deleteProduct}
      />
    </div>
  );
};