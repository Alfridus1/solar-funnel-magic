import { supabase } from "@/integrations/supabase/client";

export const handleReferral = async (userId: string, referralCode: string | null) => {
  if (!referralCode) return null;

  try {
    // Get affiliate by referral code
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (!affiliate) return null;

    // Create lead for tracking the referral
    const { error: leadError } = await supabase
      .from('leads')
      .insert([{
        name: 'Registration',
        email: 'pending',
        phone: 'pending',
        type: 'registration',
        affiliate_id: affiliate.id,
        user_id: userId,
        status: 'converted'
      }]);

    if (leadError) throw leadError;

    return affiliate.id;
  } catch (error) {
    console.error('Error handling referral:', error);
    return null;
  }
};