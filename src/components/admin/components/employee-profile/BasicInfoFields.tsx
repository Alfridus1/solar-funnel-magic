import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EmployeeProfileData } from "../../types/employeeForm";
import { Autocomplete } from "@react-google-maps/api";
import { useGeolocation } from "@/components/RoofCheck/hooks/useGeolocation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useRef } from "react";

interface BasicInfoFieldsProps {
  form: UseFormReturn<EmployeeProfileData>;
}

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  const { toast } = useToast();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { handleGeolocation } = useGeolocation({
    onSuccess: (address) => {
      form.setValue("address", address);
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: error,
        variant: "destructive",
      });
    },
    toast,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Autocomplete
                      onLoad={(autocomplete) => {
                        if (autocomplete) {
                          autocompleteRef.current = autocomplete;
                          autocomplete.setComponentRestrictions({ country: 'de' });
                          autocomplete.setOptions({
                            types: ['address'],
                            fields: ['formatted_address']
                          });
                        }
                      }}
                      onPlaceChanged={() => {
                        const place = autocompleteRef.current?.getPlace();
                        if (place?.formatted_address) {
                          form.setValue("address", place.formatted_address);
                        }
                      }}
                    >
                      <Input {...field} />
                    </Autocomplete>
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={handleGeolocation}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

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
    </div>
  );
};