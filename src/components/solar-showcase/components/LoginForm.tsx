import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const LoginForm = ({ onBack, onSuccess }: LoginFormProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl animate-fade-up">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">Anmelden</h2>
          <p className="text-center text-gray-600 mt-2">
            Melden Sie sich an, um Ihre Solaranalyse zu sehen
          </p>
        </div>
        <Auth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#F75c03',
                  brandAccent: '#F75c03',
                },
              },
            },
          }}
          providers={[]}
          onSuccess={onSuccess}
          localization={{
            variables: {
              sign_in: {
                email_label: 'E-Mail Adresse',
                password_label: 'Passwort',
                button_label: 'Anmelden',
                loading_button_label: 'Anmeldung läuft...',
                link_text: 'Noch kein Konto? Jetzt registrieren',
                email_input_placeholder: 'Ihre E-Mail Adresse',
                password_input_placeholder: 'Ihr Passwort',
              },
              sign_up: {
                email_label: 'E-Mail Adresse',
                password_label: 'Passwort',
                button_label: 'Registrieren',
                loading_button_label: 'Registrierung läuft...',
                link_text: 'Bereits ein Konto? Jetzt anmelden',
                email_input_placeholder: 'Ihre E-Mail Adresse',
                password_input_placeholder: 'Wählen Sie ein sicheres Passwort',
              },
              forgotten_password: {
                link_text: 'Passwort vergessen?',
                button_label: 'Passwort zurücksetzen',
                loading_button_label: 'Sende Anweisungen...',
                email_input_placeholder: 'Ihre E-Mail Adresse',
                confirmation_text: 'Überprüfen Sie Ihre E-Mails für den Bestätigungslink',
              },
            },
          }}
        />
        <Button
          variant="link"
          className="w-full mt-4 text-solar-orange hover:text-solar-orange-dark"
          onClick={onBack}
        >
          Zurück zur Registrierung
        </Button>
      </Card>
    </div>
  );
};