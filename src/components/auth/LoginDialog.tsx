import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metrics?: any;
  address?: string;
}

export const LoginDialog = ({ open, onOpenChange, metrics, address }: LoginDialogProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      setIsLoading(true);
      
      // Create a profile for the user if it doesn't exist
      supabase.from('profiles').upsert({
        id: session.user.id,
        email: session.user.email,
        first_name: "",
        last_name: "",
        phone: "",
        role: "customer"
      }).then(({ error }) => {
        setIsLoading(false);
        
        if (error) {
          console.error("Error creating profile:", error);
          return;
        }
        
        onOpenChange(false);
        
        // Store metrics and address in localStorage before navigation
        if (metrics) {
          localStorage.setItem('solarMetrics', JSON.stringify(metrics));
        }
        if (address) {
          localStorage.setItem('solarAddress', address);
        }
        
        // Navigate to solar-showcase
        navigate("/solar-showcase", { 
          state: { metrics, address },
          replace: true 
        });
      });
    }
  });

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-solar-orange"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#F75C03',
                  brandAccent: '#d94f02',
                }
              }
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'E-Mail',
                password_label: 'Passwort',
                button_label: 'Anmelden',
                loading_button_label: 'Anmeldung...',
                social_provider_text: 'Anmelden mit {{provider}}',
                link_text: 'Bereits ein Konto? Anmelden',
              },
              sign_up: {
                email_label: 'E-Mail',
                password_label: 'Passwort',
                button_label: 'Registrieren',
                loading_button_label: 'Registrierung...',
                social_provider_text: 'Registrieren mit {{provider}}',
                link_text: 'Kein Konto? Registrieren',
              },
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};