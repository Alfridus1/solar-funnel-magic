import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Profile, AffiliateInfo } from "./types/userManagement";

export const UserManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);
  const [emailCooldowns, setEmailCooldowns] = useState<Record<string, number>>({});
  const [isResettingPasswords, setIsResettingPasswords] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        toast({
          title: "Fehler beim Laden der Benutzer.",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleUserSelect = (user: Profile) => {
    setSelectedUser(user);
    // Fetch affiliate info if necessary
  };

  const handleResetAllPasswords = async () => {
    setIsResettingPasswords(true);
    try {
      const { data, error } = await supabase.functions.invoke('reset-passwords');
      
      if (error) {
        console.error('Error resetting passwords:', error);
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
    } catch (error) {
      console.error('Reset password error:', error);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Benutzer</h2>
        <Button 
          onClick={handleResetAllPasswords}
          disabled={isResettingPasswords}
          variant="outline"
          className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
        >
          {isResettingPasswords ? "Wird zurückgesetzt..." : "Alle Passwörter zurücksetzen"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserSelect(user)}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          affiliateInfo={affiliateInfo}
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />
      )}
    </div>
  );
};
