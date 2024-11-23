import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationFormProps {
  onComplete: () => void;
  onShowLogin: () => void;
}

export const RegistrationForm = ({ onComplete, onShowLogin }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown) {
      toast({
        title: "Bitte warten",
        description: "Aus Sicherheitsgründen müssen Sie 15 Sekunden warten, bevor Sie es erneut versuchen können.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwörter stimmen nicht überein",
        description: "Bitte überprüfen Sie Ihre Eingabe.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Passwort zu kurz",
        description: "Das Passwort muss mindestens 6 Zeichen lang sein.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (authError) {
        if (authError.status === 429) {
          setCooldown(true);
          setTimeout(() => setCooldown(false), 15000);
          throw new Error("Bitte warten Sie 15 Sekunden, bevor Sie es erneut versuchen.");
        }
        throw authError;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user?.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }]);

      if (profileError) throw profileError;

      onComplete();
      
      toast({
        title: "Willkommen!",
        description: "Ihre Daten wurden erfolgreich gespeichert. Sie können sich jetzt mit Ihrer E-Mail und Ihrem Passwort anmelden.",
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
      <Input
        type="password"
        placeholder="Passwort"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <Input
        type="password"
        placeholder="Passwort bestätigen"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        required
      />
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-solar-orange to-solar-orange-light hover:from-solar-orange-light hover:to-solar-orange text-white text-lg py-6"
        disabled={isSubmitting || cooldown}
      >
        {isSubmitting ? "Wird gespeichert..." : cooldown ? "Bitte warten..." : "Auswertung ansehen"}
      </Button>
      <p className="text-xs text-center text-gray-500">
        Mit dem Absenden stimmen Sie unseren Datenschutzbestimmungen zu
      </p>
      <div className="text-center">
        <Button
          variant="link"
          className="text-solar-orange hover:text-solar-orange-dark"
          onClick={onShowLogin}
          type="button"
        >
          Bereits ein Konto? Jetzt einloggen
        </Button>
      </div>
    </form>
  );
};