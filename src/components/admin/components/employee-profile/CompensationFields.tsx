import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { EmployeeProfileData } from "../../types/employeeForm";

interface CompensationFieldsProps {
  form: UseFormReturn<EmployeeProfileData>;
}

export const CompensationFields = ({ form }: CompensationFieldsProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};