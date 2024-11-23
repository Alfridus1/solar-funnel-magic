import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface LeadFormProps {
  formType: "quote" | "consultation" | null;
  metrics?: any;
  address?: string;
  onSuccess?: () => void;
}

export const LeadForm = ({ formType, metrics, address, onSuccess }: LeadFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    try {
      // Erst den Benutzer erstellen
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(), // Generiere ein zufälliges Passwort
        options: {
          data: {
            full_name: name,
            phone: phone,
          },
        },
      });

      if (authError) throw authError;

      // Dann den Lead mit der Benutzer-ID speichern
      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .insert([
          {
            name,
            email,
            phone,
            type: formType,
            metrics,
            address,
            user_id: authData.user?.id,
          },
        ])
        .select()
        .single();

      if (leadError) throw leadError;

      toast({
        title: "Anfrage erfolgreich gesendet",
        description: "Wir werden uns in Kürze bei Ihnen melden.",
      });

      // Navigiere zur individuellen Anfrageseite
      if (leadData) {
        navigate(`/anfrage/${leadData.id}`);
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Fehler beim Senden der Anfrage",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          placeholder="Ihr Name"
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Ihre E-Mail"
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          name="phone"
          type="tel"
          placeholder="Ihre Telefonnummer"
          required
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Wird gesendet..." : "Anfrage senden"}
      </Button>
    </form>
  );
};