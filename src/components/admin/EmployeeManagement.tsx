import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";
import { Employee, EmployeeRole } from "./types/employee";
import { EmployeeTable } from "./components/employee-management/EmployeeTable";
import { EmployeeDialog } from "./components/employee-dialog/EmployeeDialog";

export const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          profiles:profile_id (
            first_name,
            last_name,
            email,
            role,
            phone
          )
        `);

      if (error) {
        throw error;
      }

      if (!data) {
        setEmployees([]);
        return;
      }

      // Transform and validate the data to match the Employee type
      const transformedData: Employee[] = data.map(employee => ({
        id: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        role: employee.role as EmployeeRole,
        team_id: employee.team_id,
        profile_id: employee.profile_id,
        address: employee.address,
        location: employee.location,
        iban: employee.iban,
        base_salary: employee.base_salary,
        commission_enabled: employee.commission_enabled,
        vacation_days: employee.vacation_days,
        hours_per_month: employee.hours_per_month,
        has_company_car: employee.has_company_car,
        created_at: employee.created_at,
        updated_at: employee.updated_at,
        profiles: employee.profiles ? {
          first_name: employee.profiles.first_name,
          last_name: employee.profiles.last_name,
          email: employee.profiles.email,
          role: employee.profiles.role,
          phone: employee.profiles.phone || ''
        } : undefined
      }));

      setEmployees(transformedData);
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden der Mitarbeiter",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Mitarbeiter gelöscht",
        description: "Der Mitarbeiter wurde erfolgreich gelöscht.",
      });
      fetchEmployees();
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email) return;
    
    setIsResetting(true);
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
      console.error('Reset password error:', error);
      toast({
        title: "Fehler beim Zurücksetzen",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
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

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }

      if (!data?.user) {
        throw new Error('No user data returned after login');
      }

      toast({
        title: "Erfolgreich eingeloggt",
        description: `Sie sind jetzt als ${email} eingeloggt.`,
      });

      window.location.href = '/employee';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mitarbeiter</h2>
        <Button onClick={handleAddEmployee} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Mitarbeiter hinzufügen
        </Button>
      </div>

      <EmployeeTable
        employees={employees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
        onResetPassword={handleResetPassword}
        onLoginAs={handleLoginAs}
        isResetting={isResetting}
      />

      <EmployeeDialog
        employee={selectedEmployee}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchEmployees}
      />
    </div>
  );
};