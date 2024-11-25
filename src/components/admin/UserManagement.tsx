import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Profile, AffiliateInfo } from "./types/userManagement";
import { UserTableRow } from "./components/UserTableRow";
import { Card } from "@/components/ui/card";

export const UserManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);
  const [isResettingPasswords, setIsResettingPasswords] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer');

    if (error) {
      toast({
        title: "Fehler beim Laden der Benutzer",
        description: error.message,
        variant: "destructive",
      });
    } else if (profiles) {
      setUsers(profiles);
    }
  };

  const handleUserSelect = async (user: Profile) => {
    setSelectedUser(user);
    // Fetch affiliate info when user is selected
    const { data: affiliateData, error } = await supabase
      .from('affiliates')
      .select('*')
      .eq('email', user.email)
      .single();

    if (!error && affiliateData) {
      setAffiliateInfo(affiliateData);
    } else {
      setAffiliateInfo(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "Benutzer gelöscht",
        description: "Der Benutzer wurde erfolgreich gelöscht.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResetAllPasswords = async () => {
    setIsResettingPasswords(true);
    try {
      const { data, error } = await supabase.functions.invoke('reset-passwords');
      
      if (error) {
        throw new Error('Fehler beim Zurücksetzen der Passwörter');
      }

      if (data?.results) {
        const successCount = data.results.filter((r: any) => r.success).length;
        const failCount = data.results.filter((r: any) => !r.success).length;

        let description = `${successCount} Passwörter erfolgreich zurückgesetzt.`;
        if (failCount > 0) {
          description += ` ${failCount} fehlgeschlagen.`;
        }

        toast({
          title: "Passwörter zurückgesetzt",
          description: description,
        });
      }
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setIsResettingPasswords(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Kundenverwaltung</h2>
          <Button 
            onClick={handleResetAllPasswords}
            disabled={isResettingPasswords}
            variant="outline"
            className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
          >
            {isResettingPasswords ? "Wird zurückgesetzt..." : "Alle Passwörter zurücksetzen"}
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Telefon</TableHead>
                <TableHead className="font-semibold text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserTableRow 
                  key={user.id}
                  user={user}
                  onSelect={handleUserSelect}
                  onDelete={handleDeleteUser}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <UserDetailsDialog
          user={selectedUser}
          affiliateInfo={affiliateInfo}
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />
      </div>
    </Card>
  );
};