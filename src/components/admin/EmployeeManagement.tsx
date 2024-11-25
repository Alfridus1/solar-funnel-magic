import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, FileEdit, Trash2, KeyRound } from "lucide-react";
import { EmployeeDialog } from "./components/EmployeeDialog";
import { Employee } from "./types/employee";
import { roleTranslations } from "@/utils/roleTranslations";

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
        `)
        .eq('profiles.role', 'employee');

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rolle</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                {employee.profiles?.first_name} {employee.profiles?.last_name}
              </TableCell>
              <TableCell>{employee.profiles?.email}</TableCell>
              <TableCell>{roleTranslations[employee.role] || employee.role}</TableCell>
              <TableCell>{employee.team_id || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResetPassword(employee.profiles?.email || '')}
                    disabled={isResetting || !employee.profiles?.email}
                  >
                    <KeyRound className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EmployeeDialog
        employee={selectedEmployee}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchEmployees}
      />
    </div>
  );
};