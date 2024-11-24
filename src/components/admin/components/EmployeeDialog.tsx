import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from "../types/employee";
import { EmployeeFormFields } from "./EmployeeFormFields";
import { useForm } from "react-hook-form";
import { EmployeeFormData, employeeFormSchema } from "../types/employeeForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";

interface EmployeeDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EmployeeDialog = ({
  employee,
  open,
  onOpenChange,
  onSuccess,
}: EmployeeDialogProps) => {
  const { toast } = useToast();
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: employee?.profiles ? {
      first_name: employee.profiles.first_name,
      last_name: employee.profiles.last_name,
      email: employee.profiles.email,
      phone: employee.profiles.phone || "",
      role: employee.role as EmployeeFormData["role"],
      address: employee.address || "",
      location: employee.location || "",
      iban: employee.iban || "",
      base_salary: employee.base_salary || 0,
      commission_enabled: employee.commission_enabled || false,
      vacation_days: employee.vacation_days || 30,
      hours_per_month: employee.hours_per_month || 160,
      has_company_car: employee.has_company_car || false,
    } : {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "employee" as EmployeeFormData["role"],
      address: "",
      location: "",
      iban: "",
      base_salary: 0,
      commission_enabled: false,
      vacation_days: 30,
      hours_per_month: 160,
      has_company_car: false,
    },
  });

  const handleLoginAs = async () => {
    if (!employee?.profiles?.email) return;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: employee.profiles.email,
        password: 'Coppen2023!'
      });

      if (error) throw error;

      toast({
        title: "Erfolgreich eingeloggt",
        description: `Sie sind jetzt als ${employee.profiles.email} eingeloggt.`,
      });

      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Login fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      let profileId;

      if (!employee) {
        // Create new user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: "Coppen2023!",
          email_confirm: true
        });

        if (authError) throw authError;

        // Create profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
          })
          .select()
          .single();

        if (profileError) throw profileError;
        profileId = profileData.id;
      } else {
        // Update existing profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
          })
          .eq('id', employee.profile_id);

        if (profileError) throw profileError;
        profileId = employee.profile_id;
      }

      // Create or update employee
      const employeeData = {
        profile_id: profileId,
        role: data.role,
        address: data.address,
        location: data.location,
        iban: data.iban,
        base_salary: data.base_salary,
        commission_enabled: data.commission_enabled,
        vacation_days: data.vacation_days,
        hours_per_month: data.hours_per_month,
        has_company_car: data.has_company_car,
      };

      if (employee) {
        const { error } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', employee.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('employees')
          .insert([employeeData]);

        if (error) throw error;
      }

      toast({
        title: employee ? "Mitarbeiter aktualisiert" : "Mitarbeiter angelegt",
        description: `${data.first_name} ${data.last_name} wurde erfolgreich ${
          employee ? "aktualisiert" : "angelegt"
        }.`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Mitarbeiter bearbeiten" : "Neuer Mitarbeiter"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <EmployeeFormFields form={form} />
          
          <div className="flex justify-between items-center">
            <Button type="submit">
              {employee ? "Aktualisieren" : "Anlegen"}
            </Button>
            
            {employee && (
              <Button 
                type="button"
                onClick={handleLoginAs}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Als dieser Mitarbeiter einloggen
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};