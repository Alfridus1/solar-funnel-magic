import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EmployeeProfileData } from "../../types/employeeForm";
import { useLoadScript } from "@react-google-maps/api";
import { useGeolocation } from "@/components/RoofCheck/hooks/useGeolocation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useRef, useEffect } from "react";

interface BasicInfoFieldsProps {
  form: UseFormReturn<EmployeeProfileData>;
}

const libraries: ("places" | "drawing" | "geometry")[] = ["places"];

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  const { toast } = useToast();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
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

  if (loadError) {
    return (
      <div className="text-red-500">
        Fehler beim Laden der Google Maps API
      </div>
    );
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
                    {isLoaded ? (
                      <div className="flex-1">
                        <Input
                          {...field}
                          ref={(input) => {
                            if (input && !autocompleteRef.current && window.google) {
                              autocompleteRef.current = new google.maps.places.Autocomplete(input, {
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
                          }}
                        />
                      </div>
                    ) : (
                      <Input {...field} disabled placeholder="Lade Google Maps..." />
                    )}
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