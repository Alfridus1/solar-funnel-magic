import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const WalletOverview = () => {
  const { data: affiliateData } = useQuery({
    queryKey: ['affiliate-earnings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('affiliate_bonuses')
        .select('amount')
        .eq('status', 'paid')
        .eq('affiliate_id', user.id);

      const totalEarnings = data?.reduce((sum, bonus) => sum + (bonus.amount || 0), 0) || 0;
      return { earnings: totalEarnings };
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Wallet</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ihr Guthaben</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {affiliateData ? 
              `${affiliateData.earnings.toLocaleString('de-DE')} €` : 
              '0 €'}
          </div>
          <p className="text-muted-foreground">Verfügbares Guthaben</p>
        </CardContent>
      </Card>
    </div>
  );
};