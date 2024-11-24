import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metrics?: any;
  address?: string;
}

export const LoginDialog = ({ open, onOpenChange, metrics, address }: LoginDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Erfolgreich angemeldet",
          description: "Sie wurden erfolgreich angemeldet.",
        });
        onOpenChange(false);
        
        // Always navigate to solar-showcase with metrics and address if they exist
        navigate("/solar-showcase", { 
          state: metrics && address ? { metrics, address } : undefined,
          replace: true 
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, onOpenChange, toast, metrics, address]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Anmelden oder Registrieren</DialogTitle>
        </DialogHeader>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#f97316',
                  brandAccent: '#ea580c',
                }
              }
            },
            className: {
              container: 'flex-1',
              button: 'bg-solar-orange hover:bg-solar-orange-600',
              input: 'rounded-md',
            },
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email Adresse',
                password_label: 'Passwort',
                button_label: 'Anmelden',
              },
              sign_up: {
                email_label: 'Email Adresse',
                password_label: 'Passwort',
                button_label: 'Registrieren',
              },
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};