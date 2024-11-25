import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const TaskForm = ({ onSuccess, onCancel }: TaskFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let documentUrl = null;
      let documentName = null;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("task_documents")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("task_documents")
          .getPublicUrl(fileName);

        documentUrl = publicUrl;
        documentName = file.name;
      }

      const { error } = await supabase.from("tasks").insert({
        title,
        description,
        document_url: documentUrl,
        document_name: documentName,
      });

      if (error) throw error;

      toast({
        title: "Aufgabe erstellt",
        description: "Die Aufgabe wurde erfolgreich erstellt.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Fehler beim Erstellen der Aufgabe",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Titel
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Beschreibung
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="document" className="block text-sm font-medium mb-1">
          Dokument
        </label>
        <Input
          id="document"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Wird erstellt..." : "Erstellen"}
        </Button>
      </div>
    </form>
  );
};