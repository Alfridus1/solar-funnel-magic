import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/configurator/types";
import { ProductForm } from "./product/ProductForm";
import { ProductList } from "./product/ProductList";

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const { error } = await supabase
      .from('solar_products')
      .update({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        specs: editingProduct.specs,
        image_url: editingProduct.image_url
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductForm onProductAdded={loadProducts} />
        <ProductList
          products={products}
          editingProduct={editingProduct}
          onStartEditing={setEditingProduct}
          onCancelEditing={() => setEditingProduct(null)}
          onSaveEdit={handleEdit}
          onEditingProductChange={setEditingProduct}
        />
      </div>
    </div>
  );
};