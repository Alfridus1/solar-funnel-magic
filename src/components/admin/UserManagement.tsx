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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface AffiliateInfo {
  referral_code?: string;
  referral_count?: number;
  total_leads?: number;
}

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
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
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

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Benutzerdetails</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{`${selectedUser.first_name} ${selectedUser.last_name}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registriert am</p>
                  <p className="font-medium">
                    {new Date(selectedUser.created_at).toLocaleDateString('de-DE')}
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};