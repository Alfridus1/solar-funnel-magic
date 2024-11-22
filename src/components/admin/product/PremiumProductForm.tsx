import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil } from "lucide-react";

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
  const { register, handleSubmit } = useForm<ProductFormData>({
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

  return (
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