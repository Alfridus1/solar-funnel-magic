import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BasicInfoFields } from "./employee-profile/BasicInfoFields";
import { CompensationFields } from "./employee-profile/CompensationFields";
import { WorkScheduleFields } from "./employee-profile/WorkScheduleFields";

const employeeProfileSchema = z.object({
  address: z.string().min(1, "Adresse wird benötigt"),
  location: z.string().min(1, "Standort wird benötigt"),
  iban: z.string().min(1, "IBAN wird benötigt"),
  base_salary: z.number().min(1, "Fixgehalt wird benötigt"),
  commission_enabled: z.boolean(),
  vacation_days: z.number().min(1, "Urlaubstage werden benötigt"),
  hours_per_month: z.number().min(1, "Arbeitsstunden pro Monat werden benötigt"),
  has_company_car: z.boolean(),
});

export type EmployeeProfileData = z.infer<typeof employeeProfileSchema>;

interface EmployeeProfileFormProps {
  employeeId: string;
  initialData?: EmployeeProfileData;
}

export const EmployeeProfileForm = ({ employeeId, initialData }: EmployeeProfileFormProps) => {
  const { toast } = useToast();
  const form = useForm<EmployeeProfileData>({
    resolver: zodResolver(employeeProfileSchema),
    defaultValues: initialData || {
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

  const onSubmit = async (data: EmployeeProfileData) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          address: data.address,
          location: data.location,
          iban: data.iban,
          base_salary: data.base_salary,
          commission_enabled: data.commission_enabled,
          vacation_days: data.vacation_days,
          hours_per_month: data.hours_per_month,
          has_company_car: data.has_company_car,
        })
        .eq('id', employeeId);

      if (error) throw error;

      toast({
        title: "Profil aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoFields form={form} />
          <CompensationFields form={form} />
          <WorkScheduleFields form={form} />
          <Button type="submit" className="w-full">Speichern</Button>
        </form>
      </Form>
    </Card>
  );
};