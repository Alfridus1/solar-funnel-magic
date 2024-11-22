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
import { LogIn } from "lucide-react";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  referral_count: number;
}

export const UserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        referral_count:leads(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Fehler beim Laden der Benutzer",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProfiles(data.map(profile => ({
      ...profile,
      referral_count: profile.referral_count || 0
    })));
  };

  const handleImpersonation = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: "test1234" // Dies ist nur für Entwicklungszwecke!
    });

    if (error) {
      toast({
        title: "Fehler beim Einloggen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Erfolgreich eingeloggt",
      description: `Sie sind jetzt als ${email} eingeloggt.`,
    });

    // Weiterleitung zur Hauptseite
    window.location.href = "/";
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
            <TableHead>Geworbene Kunden</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{`${profile.first_name} ${profile.last_name}`}</TableCell>
              <TableCell>{profile.email}</TableCell>
              <TableCell>{profile.phone}</TableCell>
              <TableCell>
                {new Date(profile.created_at).toLocaleDateString('de-DE')}
              </TableCell>
              <TableCell>{profile.referral_count}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImpersonation(profile.email)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Als Benutzer einloggen
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};