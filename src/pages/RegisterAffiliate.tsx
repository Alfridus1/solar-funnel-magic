import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function RegisterAffiliate() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Create affiliate record
      const { error: affiliateError } = await supabase
        .from('affiliates')
        .insert([{
          user_id: authData.user?.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
        }]);

      if (affiliateError) throw affiliateError;

      toast({
        title: "Registrierung erfolgreich",
        description: "Sie werden zum Dashboard weitergeleitet.",
      });

      // Redirect to affiliate dashboard
      navigate("/affiliate-dashboard");
    } catch (error: any) {
      toast({
        title: "Fehler bei der Registrierung",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Als Affiliate registrieren</h1>
          <p className="text-gray-600 mt-2">
            Erstellen Sie Ihr Affiliate-Konto und beginnen Sie mit der Vermittlung
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Vorname"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Nachname"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="E-Mail Adresse"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Passwort"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#F75c03] to-[#FF8A3D] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Registrierung läuft..." : "Jetzt registrieren"}
          </Button>
        </form>
      </Card>
    </div>
  );
}