import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PremiumProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  climate_impact: string;
  purchase_options: {
    price: number;
    financing: {
      available: boolean;
      min_rate: number;
      max_term: number;
    };
  };
}

interface ProductFormData {
  name: string;
  description: string;
  image_url: string;
  climate_impact: string;
  features: string;
  price: number;
  financing_available: boolean;
  financing_min_rate: number;
  financing_max_term: number;
}

interface PremiumProductFormProps {
  editingProduct: PremiumProduct | null;
  loading: boolean;
  onSubmit: (data: ProductFormData) => void;
  onCancel?: () => void;
}

export const PremiumProductForm = ({
  editingProduct,
  loading,
  onSubmit,
  onCancel
}: PremiumProductFormProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch } = useForm<ProductFormData>({
    defaultValues: editingProduct ? {
      name: editingProduct.name,
      description: editingProduct.description,
      image_url: editingProduct.image_url,
      climate_impact: editingProduct.climate_impact,
      features: editingProduct.features.join('\n'),
      price: editingProduct.purchase_options.price,
      financing_available: editingProduct.purchase_options.financing.available,
      financing_min_rate: editingProduct.purchase_options.financing.min_rate,
      financing_max_term: editingProduct.purchase_options.financing.max_term
    } : undefined
  });

  const currentImageUrl = watch('image_url');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    setUploading(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(fileName);

      setValue('image_url', publicUrl);
      
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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {editingProduct ? "Premium-Produkt bearbeiten" : "Premium-Produkte verwalten"}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {currentImageUrl && (
              <img 
                src={currentImageUrl} 
                alt="Product preview" 
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Produktbild</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="flex-1"
                />
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <input type="hidden" {...register("image_url")} />
            </div>
          </div>
        </div>

        <div>
          <Input {...register("name")} placeholder="Produktname" />
        </div>
        <div>
          <Textarea {...register("description")} placeholder="Beschreibung" />
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
        <div className="grid grid-cols-2 gap-4">
          <Input 
            type="number" 
            {...register("price", { valueAsNumber: true })} 
            placeholder="Preis in €" 
          />
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                {...register("financing_available")} 
              />
              Finanzierung verfügbar
            </label>
            <Input 
              type="number" 
              step="0.1"
              {...register("financing_min_rate", { valueAsNumber: true })} 
              placeholder="Min. Zinssatz %" 
            />
            <Input 
              type="number" 
              {...register("financing_max_term", { valueAsNumber: true })} 
              placeholder="Max. Laufzeit (Monate)" 
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading || uploading}>
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
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};