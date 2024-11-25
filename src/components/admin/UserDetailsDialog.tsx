import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Profile, AffiliateInfo } from "./types/userManagement";

interface UserDetailsDialogProps {
  user: Profile | null;
  affiliateInfo: AffiliateInfo | null;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsDialog = ({ user, affiliateInfo, onOpenChange }: UserDetailsDialogProps) => {
  const [showLogin, setShowLogin] = useState(false);
  const { toast } = useToast();
  const [impersonatedUser, setImpersonatedUser] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: 'password123', // Temporary password for testing
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned after login');
      }

      // Get the user's profile to determine their role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setImpersonatedUser(user?.email || null);

      toast({
        title: "Erfolgreich eingeloggt",
        description: `Sie sind jetzt als ${user?.email} eingeloggt.`,
      });

      // Redirect based on user role
      if (profileData?.role === 'customer') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/employee/dashboard';
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setImpersonatedUser(null);
      toast({
        title: "Erfolgreich ausgeloggt",
        description: "Sie wurden erfolgreich ausgeloggt.",
      });

      // Redirect to login page
      window.location.href = '/login';
    } catch (error: any) {
      toast({
        title: "Fehler beim Ausloggen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {impersonatedUser && (
        <div className="fixed top-0 left-0 right-0 bg-[#F75c03] text-white py-2 px-4 flex justify-between items-center z-50">
          <span>Sie sind als {impersonatedUser} eingeloggt</span>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-white text-[#F75c03] hover:bg-white/90"
          >
            Ausloggen
          </Button>
        </div>
      )}
      <Dialog open={!!user} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Benutzerdetails</DialogTitle>
          </DialogHeader>

          {showLogin ? (
            <Auth 
              supabaseClient={supabase} 
              appearance={{ theme: ThemeSupa }}
              theme="light"
            />
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-gray-500">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              {user?.phone && (
                <div>
                  <p className="text-sm font-medium">Telefon</p>
                  <p className="text-sm text-gray-500">{user.phone}</p>
                </div>
              )}
              {affiliateInfo && (
                <div>
                  <p className="text-sm font-medium">Affiliate Info</p>
                  <p className="text-sm text-gray-500">
                    Referral Code: {affiliateInfo.referral_code}<br />
                    Referrals: {affiliateInfo.referral_count}<br />
                    Total Leads: {affiliateInfo.total_leads}
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button onClick={handleLogin}>
                  Als Benutzer einloggen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};