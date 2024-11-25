import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const AffiliatesOverview = () => {
  const { toast } = useToast();
  const { data: affiliateData } = useQuery({
    queryKey: ['affiliate-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    }
  });

  const handleCopyLink = () => {
    if (!affiliateData?.referral_code) return;
    
    const referralLink = `https://coppen.app/?ref=${affiliateData.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    
    toast({
      title: "Link kopiert!",
      description: "Der Empfehlungslink wurde in die Zwischenablage kopiert.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Affiliates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          {affiliateData ? (
            <div className="space-y-4">
              <p>Empfehlungen: {affiliateData.referral_count || 0}</p>
              <p>Generierte Anfragen: {affiliateData.total_leads || 0}</p>
              {affiliateData.referral_code && (
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="mt-4"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Empfehlungslink kopieren
                </Button>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Werden Sie jetzt Affiliate Partner</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};