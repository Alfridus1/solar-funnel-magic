import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function EmployeeLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          // Überprüfen, ob der Benutzer ein Mitarbeiter ist
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) throw error;

          if (profile?.role && profile.role !== 'customer') {
            toast({
              title: "Erfolgreich angemeldet",
              description: "Willkommen im Mitarbeiterbereich!",
            });
            navigate("/admin");
          } else {
            // Wenn kein Mitarbeiter oder kein Profil gefunden, ausloggen und Fehlermeldung anzeigen
            await supabase.auth.signOut();
            toast({
              title: "Zugriff verweigert",
              description: "Sie haben keine Berechtigung für den Mitarbeiterbereich.",
              variant: "destructive",
            });
          }
        } catch (error: any) {
          console.error('Profile check error:', error);
          await supabase.auth.signOut();
          toast({
            title: "Fehler beim Anmelden",
            description: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
            variant: "destructive",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Abgemeldet",
          description: "Sie wurden erfolgreich abgemeldet.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mitarbeiter-Login
          </h1>
          <p className="text-gray-600">
            Bitte melden Sie sich mit Ihren Mitarbeiterdaten an
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
                email_input_placeholder: 'Ihre E-Mail Adresse',
                password_input_placeholder: 'Ihr Passwort',
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
          view="sign_in"
        />
      </Card>
    </div>
  );
}