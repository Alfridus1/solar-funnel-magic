import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LoginFormProps {
  onBack: () => void;
  metrics?: any;
  address?: string;
}

export const LoginForm = ({ onBack, metrics, address }: LoginFormProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user && metrics && address) {
        try {
          const { error: leadError } = await supabase
            .from('leads')
            .insert([{
              name: `${session.user.user_metadata.first_name || ''} ${session.user.user_metadata.last_name || ''}`,
              email: session.user.email,
              phone: '',
              type: 'solar_analysis',
              metrics,
              address,
              user_id: session.user.id,
              calculation_id: crypto.randomUUID(),
              status: 'new'
            }]);

          if (leadError) throw leadError;
        } catch (error: any) {
          toast({
            title: "Fehler beim Speichern der Analyse",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [metrics, address, toast]);

  return (
    <div>
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
        redirectTo={`${window.location.origin}/auth/callback`}
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
    </div>
  );
};