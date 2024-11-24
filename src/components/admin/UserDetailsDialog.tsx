import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, LogIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Profile, AffiliateInfo } from "./types/userManagement";
import { supabase } from "@/integrations/supabase/client";

interface UserDetailsDialogProps {
  user: Profile | null;
  affiliateInfo: AffiliateInfo | null;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsDialog = ({ user, affiliateInfo, onOpenChange }: UserDetailsDialogProps) => {
  const { toast } = useToast();

  const copyAffiliateLink = () => {
    if (!affiliateInfo?.referral_code) return;
    
    const baseUrl = window.location.origin;
    const affiliateLink = `${baseUrl}/?ref=${affiliateInfo.referral_code}`;
    
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link kopiert!",
      description: "Der Affiliate-Link wurde in die Zwischenablage kopiert.",
    });
  };

  const handleLoginAs = async () => {
    if (!user?.email) return;

    try {
      // First, invoke the reset-password function to set a temporary password
      const { error: resetError } = await supabase.functions.invoke('reset-password', {
        body: { email: user.email }
      });

      if (resetError) throw resetError;

      // Add a small delay to ensure the password reset is processed
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Then attempt to sign in with the temporary password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: '123456' // This matches the password set in the reset-password function
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }

      if (!data?.user) {
        throw new Error('No user data returned after login');
      }

      toast({
        title: "Erfolgreich eingeloggt",
        description: `Sie sind jetzt als ${user.email} eingeloggt.`,
      });

      // Redirect to the main page
      window.location.href = '/';
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login fehlgeschlagen",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Benutzerdetails</DialogTitle>
        </DialogHeader>
        
        {user && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{`${user.first_name} ${user.last_name}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registriert am</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('de-DE')}
                </p>
              </div>
            </div>

            <Card className="p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">Affiliate Informationen</h3>
              {affiliateInfo?.referral_code ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Referral Code</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {affiliateInfo.referral_code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAffiliateLink}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Link kopieren
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Vermittlungen</p>
                      <p className="font-medium">{affiliateInfo.referral_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Leads</p>
                      <p className="font-medium">{affiliateInfo.total_leads || 0}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Kein Affiliate-Konto</p>
              )}
            </Card>

            <Button 
              onClick={handleLoginAs}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Als dieser Benutzer einloggen
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};