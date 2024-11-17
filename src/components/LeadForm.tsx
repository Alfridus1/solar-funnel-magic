import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface LeadFormProps {
  formType?: "quote" | "consultation";
}

export const LeadForm = ({ formType = "quote" }: LeadFormProps) => {
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
      // Replace this URL with your actual Zapier webhook URL
      const webhookUrl = "YOUR_ZAPIER_WEBHOOK_URL";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          type: formType,
          timestamp: new Date().toISOString(),
          source: window.location.href,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

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
    } catch (error) {
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
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
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