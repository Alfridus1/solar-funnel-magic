import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Erfolgreich angemeldet",
          description: "Willkommen zurück!",
        });
        onOpenChange(false);
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Abgemeldet",
          description: "Sie wurden erfolgreich abgemeldet.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, onOpenChange, toast]);

  const handleAuthError = (error: AuthError) => {
    toast({
      title: "Fehler bei der Anmeldung",
      description: "Bitte überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut.",
      variant: "destructive",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Willkommen zurück
          </h1>
          <p className="text-gray-600">
            Melden Sie sich an, um Ihre Solaranlage zu verwalten
          </p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#F75C03',
                  brandAccent: '#FF8A3D',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full bg-solar-orange hover:bg-solar-orange-light text-white',
              input: 'w-full rounded border-gray-300',
              label: 'text-gray-700',
              message: 'text-red-600',
            }
          }}
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
          providers={[]}
          theme="light"
          view="sign_in"
          onError={handleAuthError}
        />
      </DialogContent>
    </Dialog>
  );
};