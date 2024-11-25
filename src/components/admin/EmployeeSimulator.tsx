import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowLeftCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Employee, EmployeeRole } from "./types/employee";

export const EmployeeSimulator = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadSimulatedEmployee = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('simulated_employee_id')
        .eq('id', user.id)
        .single();

      if (profile?.simulated_employee_id) {
        setSelectedEmployee(profile.simulated_employee_id);
      }
    };

    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email
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

      const typedEmployees = (data as any[]).map(employee => ({
        ...employee,
        role: employee.role as EmployeeRole
      }));

      setEmployees(typedEmployees);
      setFilteredEmployees(typedEmployees);
    };

    loadSimulatedEmployee();
    fetchEmployees();
  }, [toast]);

  useEffect(() => {
    if (selectedRole) {
      setFilteredEmployees(employees.filter(emp => emp.role === selectedRole));
    } else {
      setFilteredEmployees(employees);
    }
  }, [selectedRole, employees]);

  const handleEmployeeSelect = async (employeeId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.rpc('set_simulated_employee', {
      user_id: user.id,
      employee_id: employeeId
    });

    if (error) {
      toast({
        title: "Fehler beim Ändern der Simulation",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSelectedEmployee(employeeId);
    toast({
      title: "Simulation geändert",
      description: `Sie simulieren jetzt die Ansicht eines anderen Mitarbeiters`,
    });
    window.location.reload();
  };

  const exitSimulation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.rpc('set_simulated_employee', {
      user_id: user.id,
      employee_id: null
    });

    if (error) {
      toast({
        title: "Fehler beim Beenden der Simulation",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSelectedEmployee(null);
    setSelectedRole("");
    toast({
      title: "Simulation beendet",
      description: "Sie sehen nun wieder Ihre normale Ansicht",
    });
    window.location.reload();
  };

  if (!selectedEmployee) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-900">Mitarbeiter simulieren</h3>
        </div>
        <div className="space-y-4">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Nach Rolle filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Alle Rollen</SelectItem>
              {Array.from(new Set(employees.map(emp => emp.role))).map(role => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            {filteredEmployees.map((employee) => (
              <Button
                key={employee.id}
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => handleEmployeeSelect(employee.id)}
              >
                {employee.profiles?.first_name} {employee.profiles?.last_name} - {employee.role}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentEmployee = employees.find(emp => emp.id === selectedEmployee);

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-blue-900">
            Simulierte Ansicht: {currentEmployee?.profiles?.first_name} {currentEmployee?.profiles?.last_name} ({currentEmployee?.role})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={exitSimulation}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
        >
          <ArrowLeftCircle className="h-4 w-4 mr-2" />
          Simulation beenden
        </Button>
      </div>
    </div>
  );
};