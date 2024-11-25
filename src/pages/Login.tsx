import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { returnTo, metrics, address } = location.state || {};

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          // Get user's profile to check their role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          // Get employee data if it exists
          const { data: employee } = await supabase
            .from('employees')
            .select('role')
            .eq('profile_id', session.user.id)
            .single();

          toast({
            title: "Erfolgreich angemeldet",
            description: "Willkommen zurück!",
          });

          // Redirect based on role hierarchy
          if (profile?.role === 'admin') {
            navigate("/admin");
          } else if (employee?.role) {
            navigate("/employee/dashboard");
          } else {
            // Regular customer
            if (returnTo && metrics) {
              navigate(returnTo, { state: { metrics, address } });
            } else {
              navigate("/dashboard");
            }
          }
        } catch (error: any) {
          console.error('Profile check error:', error);
          toast({
            title: "Fehler beim Anmelden",
            description: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
            variant: "destructive",
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast, returnTo, metrics, address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Willkommen bei Coppen
          </h1>
          <p className="text-gray-600">
            Melden Sie sich an, um fortzufahren
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
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </Card>
    </div>
  );
}