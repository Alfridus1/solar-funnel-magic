import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile, AffiliateInfo } from "./types/userManagement";
import { Employee } from "./types/employee";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { EmployeeDialog } from "./components/employee-dialog/EmployeeDialog";
import { UserTable } from "./components/UserTableRow";
import { UserFilters } from "./components/user-management/UserFilters";
import { UserActions } from "./components/user-management/UserActions";
import { useEmployees } from "./hooks/useEmployees";

export const UserManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);
  const [isResettingPasswords, setIsResettingPasswords] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const { toast } = useToast();
  const { employees, fetchEmployees, isLoading } = useEmployees();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

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
    try {
      const { data: affiliateData, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('email', user.email);

      if (error && error.code !== 'PGRST116') {
        toast({
          title: "Fehler beim Laden der Affiliate-Informationen",
          description: error.message,
          variant: "destructive",
        });
      }

      setAffiliateInfo(affiliateData && affiliateData.length > 0 ? affiliateData[0] : null);
    } catch (error: any) {
      console.error('Error fetching affiliate info:', error);
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
      
      if (error) throw new Error('Fehler beim Zurücksetzen der Passwörter');

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

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEmployeeDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };

  const handleResetPassword = async (email: string) => {
    if (!email) return;
    
    try {
      const { error } = await supabase.functions.invoke('reset-employee-password', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "Passwort zurückgesetzt",
        description: "Das Passwort wurde erfolgreich auf 'Coppen2023!' zurückgesetzt.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Zurücksetzen",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    }
  };

  const handleLoginAs = async (email: string) => {
    if (!email) return;

    try {
      const { error: resetError } = await supabase.functions.invoke('reset-employee-password', {
        body: { email }
      });

      if (resetError) throw resetError;

      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'Coppen2023!'
      });

      if (signInError) throw signInError;

      if (!data?.user) {
        throw new Error('No user data returned after login');
      }

      toast({
        title: "Erfolgreich eingeloggt",
        description: `Sie sind jetzt als ${email} eingeloggt.`,
      });

      window.location.href = '/employee';
    } catch (error: any) {
      toast({
        title: "Login fehlgeschlagen",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Benutzerverwaltung</h2>
            <UserFilters 
              userTypeFilter={userTypeFilter}
              onFilterChange={setUserTypeFilter}
            />
          </div>
          <UserActions 
            onAddEmployee={handleAddEmployee}
            onResetAllPasswords={handleResetAllPasswords}
            isResettingPasswords={isResettingPasswords}
          />
        </div>

        <UserTable
          users={users}
          employees={employees}
          onUserSelect={handleUserSelect}
          onDeleteUser={handleDeleteUser}
          onEditEmployee={handleEditEmployee}
          onResetPassword={handleResetPassword}
          onLoginAs={handleLoginAs}
          userTypeFilter={userTypeFilter}
        />

        <UserDetailsDialog
          user={selectedUser}
          affiliateInfo={affiliateInfo}
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />

        <EmployeeDialog
          employee={selectedEmployee}
          open={isEmployeeDialogOpen}
          onOpenChange={setIsEmployeeDialogOpen}
          onSuccess={fetchEmployees}
        />
      </div>
    </Card>
  );
};