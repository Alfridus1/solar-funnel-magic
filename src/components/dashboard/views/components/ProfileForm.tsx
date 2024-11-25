import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ProfileFormData } from "../types/Profile";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface ProfileFormProps {
  formData: ProfileFormData;
  setFormData: (data: ProfileFormData) => void;
  onSave: () => void;
  isEditing: boolean;
}

const profileFormSchema = z.object({
  first_name: z.string().min(1, "Vorname wird benötigt"),
  last_name: z.string().min(1, "Nachname wird benötigt"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  street: z.string().optional(),
  house_number: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  annual_consumption: z.string().optional(),
});

export const ProfileForm = ({ formData, setFormData, onSave, isEditing }: ProfileFormProps) => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: formData,
  });

  if (!isEditing) return null;

  const onSubmit = async (data: ProfileFormData) => {
    setFormData(data);
    await onSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8 border-t pt-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vorname</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Vorname" />
                    </FormControl>
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
                      <Input {...field} placeholder="Nachname" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="E-Mail" />
                  </FormControl>
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
                    <Input {...field} type="tel" placeholder="Telefon" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="annual_consumption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jährlicher Stromverbrauch (kWh)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Jährlicher Stromverbrauch (kWh)" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Straße</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Straße" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="house_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nr.</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nr." />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PLZ</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="PLZ" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Ort</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ort" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Speichern
          </Button>
        </div>
      </form>
    </Form>
  );
};