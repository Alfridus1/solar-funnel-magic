import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormData } from "../types/employeeForm";

interface EmployeeFormFieldsProps {
  form: UseFormReturn<EmployeeFormData>;
}

export const EmployeeFormFields = ({ form }: EmployeeFormFieldsProps) => {
  return (
    <>
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
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefon</FormLabel>
            <FormControl>
              <Input {...field} type="tel" />
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Wähle eine Rolle" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="customer">Kunde</SelectItem>
                <SelectItem value="sales_employee">Vertriebsmitarbeiter</SelectItem>
                <SelectItem value="external_sales">Externer Vertrieb</SelectItem>
                <SelectItem value="customer_service">Kundenservice</SelectItem>
                <SelectItem value="planning">Planung</SelectItem>
                <SelectItem value="accountant">Buchhaltung</SelectItem>
                <SelectItem value="construction_manager">Bauleiter</SelectItem>
                <SelectItem value="installation_manager">Montageleiter</SelectItem>
                <SelectItem value="installer">Monteur</SelectItem>
                <SelectItem value="executive">Geschäftsführung</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="sales_team_leader">Vertriebsleiter</SelectItem>
                <SelectItem value="sales_director">Vertriebsdirektor</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};