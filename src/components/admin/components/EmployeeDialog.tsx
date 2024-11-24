import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "../types/employee";
import { EmployeeFormFields } from "./EmployeeFormFields";
import { EmployeeFormData, employeeFormSchema } from "../types/employeeForm";

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
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "sales_employee",
      phone: "",
    },
  });

  useEffect(() => {
    if (employee && employee.profiles) {
      form.reset({
        first_name: employee.profiles.first_name,
        last_name: employee.profiles.last_name,
        email: employee.profiles.email,
        role: employee.role as EmployeeFormData["role"],
        phone: employee.profiles.phone || "",
      });
    } else {
      form.reset({
        first_name: "",
        last_name: "",
        email: "",
        role: "sales_employee",
        phone: "",
      });
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (employee) {
        // Update existing employee
        const { error: employeeError } = await supabase
          .from('employees')
          .update({
            role: data.role,
          })
          .eq('id', employee.id);

        if (employeeError) throw employeeError;

        // Update profile
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
      } else {
        // Create new profile first
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            role: data.role,
          })
          .select()
          .single();

        if (profileError) throw profileError;

        // Then create employee
        const { error: employeeError } = await supabase
          .from('employees')
          .insert({
            profile_id: profileData.id,
            role: data.role,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
          });

        if (employeeError) throw employeeError;
      }

      toast({
        title: employee ? "Mitarbeiter aktualisiert" : "Mitarbeiter erstellt",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Mitarbeiter bearbeiten" : "Neuer Mitarbeiter"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EmployeeFormFields form={form} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              <Button type="submit">
                {employee ? "Speichern" : "Erstellen"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};