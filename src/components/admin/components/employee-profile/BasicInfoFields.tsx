import { useEffect, useRef } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EmployeeProfileData } from "../../types/employeeForm";
import { useGeolocation } from "@/components/RoofCheck/hooks/useGeolocation";
import { useToast } from "@/components/ui/use-toast";
import { useLoadScript } from "@react-google-maps/api";

interface BasicInfoFieldsProps {
  form: UseFormReturn<EmployeeProfileData>;
}

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  const { toast } = useToast();
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

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

  useEffect(() => {
    if (isLoaded && addressInputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
        componentRestrictions: { country: 'de' },
        fields: ['formatted_address'],
        types: ['address']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          form.setValue("address", place.formatted_address);
        }
      });
    }
  }, [isLoaded, form]);

  if (loadError) {
    toast({
      title: "Fehler",
      description: "Google Maps konnte nicht geladen werden",
      variant: "destructive",
    });
  }

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
                    <Input
                      {...field}
                      ref={addressInputRef}
                      disabled={!isLoaded}
                      placeholder={!isLoaded ? "Lade Google Maps..." : "Adresse eingeben"}
                    />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={handleGeolocation}
                    disabled={!isLoaded}
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