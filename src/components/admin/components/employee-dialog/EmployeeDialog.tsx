import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "../../types/employee";
import { EmployeeFormData, employeeFormSchema } from "../../types/employeeForm";
import { BasicInfoTab } from "./BasicInfoTab";
import { ProfileTab } from "./ProfileTab";

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
        await handleEmployeeUpdate(data);
      } else {
        await handleEmployeeCreate(data);
      }

      toast({
        title: employee ? "Mitarbeiter aktualisiert" : "Mitarbeiter erstellt",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Fehler",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    }
  };

  const handleEmployeeUpdate = async (data: EmployeeFormData) => {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      })
      .eq('id', employee!.profile_id);

    if (profileError) throw profileError;

    const { error: employeeError } = await supabase
      .from('employees')
      .update({
        role: data.role,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      })
      .eq('id', employee!.id);

    if (employeeError) throw employeeError;
  };

  const handleEmployeeCreate = async (data: EmployeeFormData) => {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: "Coppen2023!",
      email_confirm: true
    });

    if (authError) throw authError;

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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Mitarbeiter bearbeiten" : "Neuer Mitarbeiter"}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basisdaten</TabsTrigger>
            {employee && <TabsTrigger value="profile">Profil</TabsTrigger>}
          </TabsList>
          <TabsContent value="basic">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <BasicInfoTab form={form} />
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
          </TabsContent>
          {employee && (
            <TabsContent value="profile">
              <ProfileTab employeeId={employee.id} />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};