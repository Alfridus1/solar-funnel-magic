import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { Profile, AffiliateInfo } from "./types/userManagement";

export const UserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Fehler beim Laden der Benutzer",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProfiles(data || []);
  };

  const loadAffiliateInfo = async (userId: string) => {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Fehler beim Laden der Affiliate-Informationen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setAffiliateInfo(data || { referral_code: undefined, referral_count: 0, total_leads: 0 });
  };

  const handleUserClick = async (profile: Profile) => {
    setSelectedUser(profile);
    await loadAffiliateInfo(profile.id);
  };

  const handleSendLoginLink = async (profile: Profile) => {
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        title: "Fehler beim Senden des Login-Links",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Login-Link gesendet",
      description: `Ein Login-Link wurde an ${profile.email} gesendet.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Benutzer</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Registriert am</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow 
              key={profile.id}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell onClick={() => handleUserClick(profile)}>
                {`${profile.first_name} ${profile.last_name}`}
              </TableCell>
              <TableCell onClick={() => handleUserClick(profile)}>
                {profile.email}
              </TableCell>
              <TableCell onClick={() => handleUserClick(profile)}>
                {profile.phone}
              </TableCell>
              <TableCell onClick={() => handleUserClick(profile)}>
                {new Date(profile.created_at).toLocaleDateString('de-DE')}
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendLoginLink(profile);
                  }}
                >
                  Login-Link senden
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UserDetailsDialog 
        user={selectedUser}
        affiliateInfo={affiliateInfo}
        onOpenChange={() => setSelectedUser(null)}
      />
    </div>
  );
};