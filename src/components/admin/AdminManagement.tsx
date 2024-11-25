import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminManagement = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create profile with admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          email: email,
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User',
          phone: ''
        }]);

      if (profileError) throw profileError;

      toast({
        title: "Admin hinzugefügt",
        description: "Der neue Admin wurde erfolgreich angelegt.",
      });

      setEmail("");
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Admin hinzufügen</h2>
          <p className="text-gray-600 mt-1">
            Fügen Sie einen neuen Administrator hinzu
          </p>
        </div>

        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-Mail Adresse
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Wird hinzugefügt..." : "Admin hinzufügen"}
          </Button>
        </form>
      </div>
    </Card>
  );
};