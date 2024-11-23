import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "./LoginForm";

interface RegistrationOverlayProps {
  onComplete: () => void;
}

export const RegistrationOverlay = ({ onComplete }: RegistrationOverlayProps) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
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
      // First check if a profile with this email already exists
      const { data: existingProfiles, error: queryError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email);

      if (queryError) throw queryError;

      const existingProfile = existingProfiles?.[0];

      if (existingProfile) {
        // If profile exists, just update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          })
          .eq('id', existingProfile.id);

        if (updateError) throw updateError;
      } else {
        // If no profile exists, create new auth user and profile
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
      }

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

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />;
  }

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
        </form>
        <div className="mt-6 text-center">
          <Button
            variant="link"
            className="text-solar-orange hover:text-solar-orange-dark"
            onClick={() => setShowLogin(true)}
          >
            Bereits ein Konto? Jetzt einloggen
          </Button>
        </div>
      </Card>
    </div>
  );
};