import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metrics?: any;
  address?: string;
}

export const LoginDialog = ({ open, onOpenChange, metrics, address }: LoginDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          // First check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          if (!profile) {
            // Check if email is already used
            const { data: emailProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', session.user.email)
              .maybeSingle();

            if (emailProfile) {
              // Update existing profile with new user id
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ id: session.user.id })
                .eq('id', emailProfile.id);

              if (updateError) throw updateError;
            } else {
              // Create new profile
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  first_name: '',
                  last_name: '',
                  phone: '',
                  permissions: ['customer_access'],
                  role: 'customer'
                });

              if (insertError) throw insertError;
            }
          }

          toast({
            title: "Erfolgreich angemeldet",
            description: "Willkommen zurück!",
          });
          
          onOpenChange(false);
          
          if (metrics) {
            navigate("/solar-showcase", { state: { metrics, address } });
          } else {
            navigate("/");
          }
        } catch (error: any) {
          console.error('Error during sign in:', error);
          toast({
            title: "Fehler bei der Anmeldung",
            description: "Bitte versuchen Sie es später erneut.",
            variant: "destructive",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Erfolgreich abgemeldet",
          description: "Auf Wiedersehen!",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, onOpenChange, toast, metrics, address]);

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
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </DialogContent>
    </Dialog>
  );
};