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
      .maybeSingle(); // Changed from .single() to .maybeSingle()

    if (error && error.code !== 'PGRST116') { // Only throw if it's not a "no rows returned" error
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow 
              key={profile.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleUserClick(profile)}
            >
              <TableCell>{`${profile.first_name} ${profile.last_name}`}</TableCell>
              <TableCell>{profile.email}</TableCell>
              <TableCell>{profile.phone}</TableCell>
              <TableCell>
                {new Date(profile.created_at).toLocaleDateString('de-DE')}
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