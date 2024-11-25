import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Profile, AffiliateInfo } from "./types/userManagement";
import { roleTranslations } from "@/utils/roleTranslations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface UserDetailsDialogProps {
  user: Profile | null;
  affiliateInfo: AffiliateInfo | null;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsDialog = ({ user, affiliateInfo, onOpenChange }: UserDetailsDialogProps) => {
  const { toast } = useToast();

  const handleRoleChange = async (newRole: UserRole) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Fehler beim Aktualisieren der Rolle",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Rolle aktualisiert",
        description: "Die Benutzerrolle wurde erfolgreich aktualisiert.",
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Benutzerdetails</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Benutzer ID</Label>
            <p className="text-sm text-gray-500">{user.id}</p>
          </div>
          
          <div className="grid gap-2">
            <Label>Name</Label>
            <p className="text-sm text-gray-500">{`${user.first_name} ${user.last_name}`}</p>
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <div className="grid gap-2">
            <Label>Rolle</Label>
            <Select
              value={user.role || "customer"}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rolle auswählen" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleTranslations).map(([value, label]) => (
                  value && (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          </div>

          {affiliateInfo && (
            <>
              <div className="grid gap-2">
                <Label>Affiliate Informationen</Label>
                <div className="text-sm text-gray-500">
                  <p>Referral Code: {affiliateInfo.referral_code}</p>
                  <p>Anzahl Referrals: {affiliateInfo.referral_count}</p>
                  <p>Gesamte Leads: {affiliateInfo.total_leads}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};