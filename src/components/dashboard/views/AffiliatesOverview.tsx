import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AffiliatesOverview = () => {
  const { data: affiliateData } = useQuery({
    queryKey: ['affiliate-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return data;
    }
  });

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
            </div>
          ) : (
            <p className="text-muted-foreground">Werden Sie jetzt Affiliate Partner</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};