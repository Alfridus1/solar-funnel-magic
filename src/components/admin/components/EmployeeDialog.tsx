import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "../types/employee";

interface EmployeeDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export const EmployeeDialog = ({
  employee,
  open,
  onOpenChange,
  onSuccess,
}: EmployeeDialogProps) => {
  const { toast } = useToast();
  const form = useForm<EmployeeFormData>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "",
    },
  });

  useEffect(() => {
    if (employee && employee.profiles) {
      form.reset({
        first_name: employee.profiles.first_name,
        last_name: employee.profiles.last_name,
        email: employee.profiles.email,
        role: employee.role,
      });
    } else {
      form.reset({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
      });
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (employee) {
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update({
            role: data.role,
          })
          .eq('id', employee.id);

        if (error) throw error;

        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
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
            role: 'employee',
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
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vorname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nachname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rolle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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