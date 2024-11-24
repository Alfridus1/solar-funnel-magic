import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RegistrationFields } from "./components/RegistrationFields";
import { saveInitialLead } from "./utils/saveInitialLead";

interface RegistrationFormProps {
  onComplete: () => void;
  onShowLogin: () => void;
  metrics?: any;
  address?: string;
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

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get referral code from localStorage if it exists
      const referralCode = localStorage.getItem('referralCode');
      
      // If there's a referral code, get the affiliate's ID
      let affiliateId: string | null = null;
      if (referralCode) {
        const { data: affiliate } = await supabase
          .from('affiliates')
          .select('id')
          .eq('referral_code', referralCode)
          .single();
        
        if (affiliate) {
          affiliateId = affiliate.id;
        }
      }

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

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user?.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone
        }]);

      if (profileError) throw profileError;

      // Save the initial lead with the calculation data
      if (metrics && address && authData.user) {
        await saveInitialLead(authData.user.id, formData, metrics, address);
      }

      // Clear the referral code from localStorage after successful registration
      localStorage.removeItem('referralCode');

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
      <RegistrationFields 
        formData={formData}
        onChange={handleFieldChange}
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