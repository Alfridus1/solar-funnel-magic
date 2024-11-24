import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormData } from "../../types/employeeForm";

interface WorkScheduleFieldsProps {
  form: UseFormReturn<EmployeeFormData>;
}

export const WorkScheduleFields = ({ form }: WorkScheduleFieldsProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};