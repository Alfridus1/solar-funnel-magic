import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
}

export const ImageUpload = ({ currentImageUrl, onImageUploaded }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    setUploading(true);
    
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(fileName);

      onImageUploaded(publicUrl);
      
      toast({
        title: "Bild hochgeladen",
        description: "Das Produktbild wurde erfolgreich hochgeladen.",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
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
        </div>
      </div>
    </div>
  );
};