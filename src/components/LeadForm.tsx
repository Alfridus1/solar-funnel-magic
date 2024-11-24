import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LeadFormProps {
  formType?: "quote" | "consultation";
  onSuccess?: () => void;
  metrics?: any;
  address?: string;
}

export const LeadForm = ({ formType = "quote", onSuccess, metrics, address }: LeadFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create or update profile if user is logged in
      if (user) {
        // Check if profile exists
        const { data: existingProfiles, error: profileQueryError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', formData.email);

        if (profileQueryError) throw profileQueryError;

        // If no profile exists or multiple profiles exist, create/update using user.id
        if (!existingProfiles || existingProfiles.length === 0) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              first_name: formData.name.split(' ')[0],
              last_name: formData.name.split(' ').slice(1).join(' '),
              email: formData.email,
              phone: formData.phone,
            });

          if (profileError) throw profileError;
        }
      }

      // Insert lead with user_id if logged in
      const { error } = await supabase
        .from('leads')
        .insert([{
          ...formData,
          type: formType,
          source: window.location.href,
          status: 'new',
          metrics: metrics || null,
          address: address || null,
          user_id: user?.id || null // Link to user if logged in
        }]);

      if (error) throw error;

      toast({
        title: formType === "quote" 
          ? "Vielen Dank für Ihre Anfrage!"
          : "Vielen Dank für Ihre Terminanfrage!",
        description: formType === "quote"
          ? "Wir senden Ihnen in Kürze ein individuelles Angebot zu."
          : "Wir melden uns zeitnah bei Ihnen zur Terminvereinbarung.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Ein Fehler ist aufgetreten",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <div>
        <Input
          type="text"
          placeholder="Ihr Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Ihre E-Mail-Adresse"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="tel"
          placeholder="Ihre Telefonnummer"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="w-full"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#F75c03] to-[#FF8A3D] text-white hover:from-[#FF8A3D] hover:to-[#F75c03]"
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? "Wird gesendet..." 
          : formType === "quote"
            ? "Kostenloses Angebot anfordern"
            : "Beratungstermin anfragen"
        }
      </Button>
      <p className="text-xs text-center text-gray-500 mt-2">
        Mit dem Absenden stimmen Sie unseren Datenschutzbestimmungen zu
      </p>
    </form>
  );
};