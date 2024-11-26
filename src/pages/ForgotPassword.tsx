import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Passwort zurücksetzen
          </h1>
          <p className="text-gray-600">
            Geben Sie Ihre E-Mail-Adresse ein
          </p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          view="forgot_password"
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
          providers={[]}
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </Card>
    </div>
  );
}