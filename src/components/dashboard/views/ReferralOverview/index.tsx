import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReferralStats } from "./components/ReferralStats";
import { ReferralLink } from "./components/ReferralLink";
import { HowItWorks } from "./components/HowItWorks";

export const ReferralOverview = () => {
  const { data: affiliateData } = useQuery({
    queryKey: ['affiliate-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let { data: affiliate, error: affiliateError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (affiliateError && affiliateError.code !== 'PGRST116') {
        throw affiliateError;
      }

      if (!affiliate) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

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

      const { data: bonuses } = await supabase
        .from('affiliate_bonuses')
        .select('*')
        .eq('affiliate_id', affiliate.id);

      const totalCommission = bonuses?.reduce((sum, bonus) => sum + Number(bonus.amount), 0) || 0;
      const purchaseCommissions = bonuses?.filter(bonus => bonus.commission_type === 'purchase') || [];
      const totalPurchaseAmount = purchaseCommissions.reduce((sum, bonus) => sum + Number(bonus.purchase_amount), 0);

      return {
        ...affiliate,
        totalCommission,
        totalPurchaseAmount,
        purchaseCount: purchaseCommissions.length
      };
    }
  });

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Empfehlungsprogramm</h1>
      <ReferralStats affiliateData={affiliateData} />
      <ReferralLink referralCode={affiliateData?.referral_code} />
      <HowItWorks />
    </div>
  );
};