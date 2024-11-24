import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy } from "lucide-react";

interface AffiliateData {
  id: string;
  referral_code: string;
  referral_count: number;
  total_leads: number;
}

export const ReferralOverview = () => {
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Check if user is already an affiliate
      let { data: affiliate } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      // If not, create affiliate record
      if (!affiliate) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const { data: newAffiliate, error } = await supabase
            .from('affiliates')
            .insert([{
              user_id: session.user.id,
              first_name: profile.first_name,
              last_name: profile.last_name,
              email: profile.email
            }])
            .select()
            .single();

          if (error) throw error;
          affiliate = newAffiliate;
        }
      }

      setAffiliateData(affiliate);
    } catch (error) {
      console.error('Error loading affiliate data:', error);
      toast({
        title: "Fehler",
        description: "Ihre Affiliate-Daten konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!affiliateData?.referral_code) return;
    
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/?ref=${affiliateData.referral_code}`;
    
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link kopiert!",
      description: "Ihr Empfehlungslink wurde in die Zwischenablage kopiert.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Empfehlungsprogramm</h1>
        <Card>
          <CardContent className="p-6">
            Laden...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Empfehlungsprogramm</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ihr Empfehlungslink</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Teilen Sie diesen Link mit Ihren Kontakten und profitieren Sie von erfolgreichen Vermittlungen.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted p-2 rounded">
                {affiliateData?.referral_code ? 
                  `${window.location.origin}/?ref=${affiliateData.referral_code}` : 
                  'Wird geladen...'}
              </code>
              <Button 
                variant="outline" 
                size="icon"
                onClick={copyReferralLink}
                disabled={!affiliateData?.referral_code}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ihre Statistiken</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Vermittlungen
                </dt>
                <dd className="text-2xl font-bold">
                  {affiliateData?.referral_count || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Leads
                </dt>
                <dd className="text-2xl font-bold">
                  {affiliateData?.total_leads || 0}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};