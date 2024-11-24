import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Users, Link, Copy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ReferralOverview = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { data: affiliateData } = useQuery({
    queryKey: ['affiliate-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get or create affiliate record
      let { data: affiliate } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!affiliate) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', user.id)
          .single();

        if (!profile) throw new Error('Profile not found');

        const { data: newAffiliate, error } = await supabase
          .from('affiliates')
          .insert({
            user_id: user.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email
          })
          .select()
          .single();

        if (error) throw error;
        affiliate = newAffiliate;
      }

      return affiliate;
    }
  });

  const referralLink = affiliateData 
    ? `${window.location.origin}/?ref=${affiliateData.referral_code}`
    : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link kopiert!",
      description: "Der Empfehlungslink wurde in die Zwischenablage kopiert.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Empfehlungsprogramm</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Registrierungen</p>
              <p className="text-2xl font-bold">{affiliateData?.referral_count || 0}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Anzahl der Registrierungen über Ihren Link
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <Link className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Leads</p>
              <p className="text-2xl font-bold">{affiliateData?.total_leads || 0}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Generierte Leads über Ihre Empfehlungen
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ihr persönlicher Empfehlungslink</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-gray-50 p-3 rounded-lg break-all">
            <p className="text-sm">{referralLink}</p>
          </div>
          <Button
            onClick={handleCopyLink}
            className="shrink-0"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Kopiert!" : "Link kopieren"}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Teilen Sie diesen Link mit Ihren Kontakten. Für jede erfolgreiche Empfehlung erhalten Sie eine Provision.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">So funktioniert's</h2>
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <p className="font-medium">Teilen Sie Ihren Link</p>
              <p className="text-sm text-gray-600">
                Senden Sie Ihren persönlichen Empfehlungslink an Interessenten
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <p className="font-medium">Registrierung</p>
              <p className="text-sm text-gray-600">
                Wenn sich jemand über Ihren Link registriert, wird dies automatisch erfasst
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <p className="font-medium">Provision</p>
              <p className="text-sm text-gray-600">
                Für jede erfolgreiche Vermittlung erhalten Sie eine attraktive Provision
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};