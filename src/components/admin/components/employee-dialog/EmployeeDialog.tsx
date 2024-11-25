import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Employee } from "../../types/employee";

const formSchema = z.object({
  first_name: z.string().min(2, "Vorname muss mindestens 2 Zeichen lang sein"),
  last_name: z.string().min(2, "Nachname muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  role: z.string(),
});

type EmployeeFormData = z.infer<typeof formSchema>;

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
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "sales_employee",
    },
  });

  useEffect(() => {
    if (employee && employee.profiles) {
      form.reset({
        first_name: employee.profiles.first_name,
        last_name: employee.profiles.last_name,
        email: employee.profiles.email,
        role: employee.role as EmployeeFormData["role"],
      });
    } else {
      form.reset({
        first_name: "",
        last_name: "",
        email: "",
        role: "sales_employee",
      });
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeFormData) => {
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

        const { error: employeeError } = await supabase.from("employees").insert({
          profile_id: profileData.id,
          role: data.role,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
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
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
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