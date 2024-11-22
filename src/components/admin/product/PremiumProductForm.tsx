import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { PremiumProductFormFields } from "./types";

interface PremiumProductFormProps {
  editingProduct: PremiumProduct | null;
  loading: boolean;
  onSubmit: (data: PremiumProductFormFields) => void;
  onCancel?: () => void;
}

export const PremiumProductForm = ({
  editingProduct,
  loading,
  onSubmit,
  onCancel
}: PremiumProductFormProps) => {
  const { register, handleSubmit, setValue, watch } = useForm<PremiumProductFormFields>({
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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {editingProduct ? "Premium-Produkt bearbeiten" : "Premium-Produkte verwalten"}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ImageUpload
          currentImageUrl={currentImageUrl}
          onImageUploaded={(url) => setValue('image_url', url)}
        />

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