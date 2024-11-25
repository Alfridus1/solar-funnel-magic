import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "../../types/employee";
import { EmployeeForm } from "./EmployeeForm";
import { EmployeeFormData } from "./types";

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

  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      if (employee) {
        // Update existing employee
        const { error: employeeError } = await supabase
          .from("employees")
          .update({
            role: data.role,
          })
          .eq("id", employee.id);

        if (employeeError) throw employeeError;

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            role: data.role,
          })
          .eq("id", employee.profile_id);

        if (profileError) throw profileError;

        toast({
          title: "Mitarbeiter aktualisiert",
          description: "Die Änderungen wurden erfolgreich gespeichert.",
        });
      } else {
        // Create new employee
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            role: data.role,
            phone: "",
          })
          .select()
          .single();

        if (profileError) throw profileError;

        const { error: employeeError } = await supabase
          .from("employees")
          .insert({
            profile_id: profileData.id,
            role: data.role,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
          });

        if (employeeError) throw employeeError;

        toast({
          title: "Mitarbeiter erstellt",
          description: "Der neue Mitarbeiter wurde erfolgreich angelegt.",
        });
      }

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

        <EmployeeForm
          defaultValues={employee ? {
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            role: employee.role,
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};