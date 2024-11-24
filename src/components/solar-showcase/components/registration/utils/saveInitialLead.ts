import { supabase } from "@/integrations/supabase/client";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const saveInitialLead = async (
  userId: string,
  formData: FormData,
  metrics: any,
  address: string,
  affiliateId?: string | null
) => {
  const { error } = await supabase
    .from('leads')
    .insert([
      {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        type: 'calculation',
        metrics,
        address,
        user_id: userId,
        affiliate_id: affiliateId,
        status: 'new'
      }
    ]);

  if (error) throw error;
};