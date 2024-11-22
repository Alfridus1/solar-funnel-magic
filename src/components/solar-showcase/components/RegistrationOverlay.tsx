import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationOverlayProps {
  onComplete: () => void;
}

export const RegistrationOverlay = ({ onComplete }: RegistrationOverlayProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }]);

      if (error) throw error;

      onComplete();
      
      toast({
        title: "Willkommen!",
        description: "Ihre Daten wurden erfolgreich gespeichert.",
      });
    } catch (error: any) {
      toast({
        title: "Ein Fehler ist aufgetreten",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl animate-fade-up">
        <h2 className="text-2xl font-bold text-center mb-6">
          Ihre persönliche Solaranalyse
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Geben Sie Ihre Daten ein, um Ihre individuelle Auswertung zu sehen
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Vorname"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              placeholder="Nachname"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <Input
            type="email"
            placeholder="E-Mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="tel"
            placeholder="Handynummer"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-solar-orange to-solar-orange-light hover:from-solar-orange-light hover:to-solar-orange text-white text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird gespeichert..." : "Auswertung ansehen"}
          </Button>
          <p className="text-xs text-center text-gray-500 mt-4">
            Mit dem Absenden stimmen Sie unseren Datenschutzbestimmungen zu
          </p>
        </form>
      </Card>
    </div>
  );
};