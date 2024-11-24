import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const employeeProfileSchema = z.object({
  address: z.string().min(1, "Adresse wird benötigt"),
  location: z.string().min(1, "Standort wird benötigt"),
  iban: z.string().min(1, "IBAN wird benötigt"),
  base_salary: z.string().min(1, "Fixgehalt wird benötigt"),
  commission_enabled: z.boolean(),
  vacation_days: z.string().min(1, "Urlaubstage werden benötigt"),
  hours_per_month: z.string().min(1, "Arbeitsstunden pro Monat werden benötigt"),
  has_company_car: z.boolean(),
});

type EmployeeProfileData = z.infer<typeof employeeProfileSchema>;

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
      base_salary: "",
      commission_enabled: false,
      vacation_days: "30",
      hours_per_month: "160",
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
          base_salary: parseFloat(data.base_salary),
          commission_enabled: data.commission_enabled,
          vacation_days: parseInt(data.vacation_days),
          hours_per_month: parseInt(data.hours_per_month),
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Standort</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iban"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IBAN</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="base_salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fixgehalt</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commission_enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Provision</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vacation_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urlaubstage</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hours_per_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arbeitsstunden pro Monat</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_company_car"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Firmenfahrzeug</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Speichern</Button>
        </form>
      </Form>
    </Card>
  );
};