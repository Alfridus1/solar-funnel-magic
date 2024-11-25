import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export const AdminManagement = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin');

    if (error) {
      toast({
        title: "Fehler beim Laden der Administratoren",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setAdmins(data);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingProfile) {
        // If profile exists, just update the role to admin
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', existingProfile.id);

        if (updateError) throw updateError;

        toast({
          title: "Admin aktualisiert",
          description: "Der Benutzer wurde erfolgreich zum Admin gemacht.",
        });
      } else {
        // If profile doesn't exist, create new admin profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            email: email,
            role: 'admin',
            first_name: 'Admin',
            last_name: 'User',
            phone: ''
          }]);

        if (profileError) throw profileError;

        toast({
          title: "Admin hinzugefügt",
          description: "Der neue Admin wurde erfolgreich angelegt.",
        });
      }

      setEmail("");
      fetchAdmins(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (adminId: string) => {
    setIsResetting(true);
    try {
      const { error } = await supabase.functions.invoke('reset-employee-password', {
        body: { userId: adminId, newPassword: '123456' }
      });

      if (error) throw error;

      toast({
        title: "Passwort zurückgesetzt",
        description: "Das Passwort wurde erfolgreich auf '123456' zurückgesetzt.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Zurücksetzen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Admin hinzufügen</h2>
            <p className="text-gray-600 mt-1">
              Fügen Sie einen neuen Administrator hinzu oder machen Sie einen bestehenden Benutzer zum Admin
            </p>
          </div>

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-Mail Adresse
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Wird hinzugefügt..." : "Admin hinzufügen"}
            </Button>
          </form>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Administratoren</h2>
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
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.first_name} {admin.last_name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetPassword(admin.id)}
                      disabled={isResetting}
                    >
                      Passwort zurücksetzen
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};