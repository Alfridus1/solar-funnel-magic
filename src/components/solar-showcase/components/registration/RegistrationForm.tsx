import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationFormProps {
  onComplete: () => void;
  onShowLogin: () => void;
  metrics: any;
  address: string;
}

export const RegistrationForm = ({ onComplete, onShowLogin, metrics, address }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const parseAddress = (fullAddress: string) => {
    try {
      // Extract street, house number, postal code, and city from the address string
      const parts = fullAddress.split(',').map(part => part.trim());
      const streetParts = parts[0].split(' ');
      const houseNumber = streetParts.pop() || '';
      const street = streetParts.join(' ');
      
      // Try to extract postal code and city from the second part
      const locationParts = parts[1]?.split(' ') || [];
      const postalCode = locationParts[0];
      const city = locationParts.slice(1).join(' ');

      return {
        street,
        house_number: houseNumber,
        postal_code: postalCode,
        city
      };
    } catch (error) {
      console.error('Error parsing address:', error);
      return {
        street: '',
        house_number: '',
        postal_code: '',
        city: ''
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (authError) throw authError;

      // Parse the address
      const addressDetails = parseAddress(address);

      // Create profile with address information
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user?.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          ...addressDetails // Include parsed address details
        }]);

      if (profileError) throw profileError;

      // Create a lead with the metrics data and link it to the user's profile
      if (metrics && address) {
        const { error: leadError } = await supabase
          .from('leads')
          .insert([{
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            type: 'solar_analysis',
            metrics,
            address,
            user_id: authData.user?.id,
            calculation_id: crypto.randomUUID(),
            status: 'new'
          }]);

        if (leadError) throw leadError;
      }

      onComplete();
      
      toast({
        title: "Willkommen!",
        description: "Ihre Daten wurden erfolgreich gespeichert.",
      });
    } catch (error: any) {
      toast({
        title: "Ein Fehler ist aufgetreten",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Vorname"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <Input
          placeholder="Nachname"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>
      <Input
        type="email"
        placeholder="E-Mail"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        type="tel"
        placeholder="Handynummer"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <Input
        type="password"
        placeholder="Passwort"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-solar-orange to-solar-orange-light hover:from-solar-orange-light hover:to-solar-orange text-white text-lg py-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Wird gespeichert..." : "Auswertung ansehen"}
      </Button>
      <p className="text-xs text-center text-gray-500">
        Mit dem Absenden stimmen Sie unseren Datenschutzbestimmungen zu
      </p>
      <div className="text-center">
        <Button
          variant="link"
          className="text-solar-orange hover:text-solar-orange-dark"
          onClick={onShowLogin}
          type="button"
        >
          Bereits ein Konto? Jetzt einloggen
        </Button>
      </div>
    </form>
  );
};