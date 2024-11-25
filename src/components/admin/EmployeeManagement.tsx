import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";
import { Employee } from "./types/employee";
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
          profiles (
            first_name,
            last_name,
            email,
            role,
            phone
          )
        `);

      if (error) {
        toast({
          title: "Fehler beim Laden der Mitarbeiter",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setEmployees(data);
      }
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