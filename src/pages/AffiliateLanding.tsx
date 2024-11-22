import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Euro, Users, ArrowRight, CheckCircle } from "lucide-react";
import { FAQ } from "@/components/FAQ";
import { Testimonials } from "@/components/Testimonials";

export function AffiliateLanding() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: settings } = await supabase
        .from('company_settings')
        .select('affiliate_bonus')
        .single();

      const { data: existingAffiliate } = await supabase
        .from('affiliates')
        .select()
        .eq('email', email)
        .single();

      if (existingAffiliate) {
        toast({
          title: "Sie sind bereits registriert",
          description: "Bitte loggen Sie sich ein, um Ihr Affiliate-Dashboard zu sehen.",
          variant: "destructive",
        });
        return;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8), // Generate random password
      });

      if (authError) throw authError;

      // Create affiliate record
      const { data, error } = await supabase
        .from('affiliates')
        .insert([
          { 
            email,
            first_name: '',
            last_name: '',
            user_id: authData.user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Erfolgreich registriert!",
        description: "Wir haben Ihnen eine E-Mail mit weiteren Informationen gesendet.",
      });

    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Verdienen Sie mit <span className="text-solar-orange">Solarenergie</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Empfehlen Sie uns weiter und verdienen Sie pro erfolgreicher Vermittlung attraktive Provisionen
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center space-y-4">
              <Euro className="h-12 w-12 mx-auto text-solar-orange" />
              <h3 className="text-xl font-semibold">Attraktive Provision</h3>
              <p className="text-gray-600">200€ pro erfolgreicher Vermittlung für Sie und Ihren Kontakt</p>
            </Card>
            <Card className="p-6 text-center space-y-4">
              <Users className="h-12 w-12 mx-auto text-solar-orange" />
              <h3 className="text-xl font-semibold">Einfache Verwaltung</h3>
              <p className="text-gray-600">Übersichtliches Dashboard zur Verwaltung Ihrer Empfehlungen</p>
            </Card>
            <Card className="p-6 text-center space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-solar-orange" />
              <h3 className="text-xl font-semibold">Transparente Abrechnung</h3>
              <p className="text-gray-600">Nachvollziehbare Abrechnungen und schnelle Auszahlung</p>
            </Card>
          </div>

          {/* Registration Form */}
          <Card className="p-8 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">Jetzt Affiliate Partner werden</h2>
                <p className="text-gray-600">
                  Registrieren Sie sich jetzt und erhalten Sie Ihren persönlichen Empfehlungslink
                </p>
              </div>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-solar-orange hover:bg-solar-orange-dark"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Wird verarbeitet..."
                  ) : (
                    <>
                      Partner werden <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* How it works */}
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-semibold">So funktioniert's</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-solar-orange mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Registrieren</h3>
                <p className="text-gray-600">Melden Sie sich kostenlos als Partner an</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-solar-orange mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Empfehlen</h3>
                <p className="text-gray-600">Teilen Sie Ihren persönlichen Link</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-solar-orange mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Verdienen</h3>
                <p className="text-gray-600">Erhalten Sie Ihre Provision</p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <Testimonials />

          {/* FAQ Section */}
          <FAQ />
        </div>
      </div>
    </div>
  );
}