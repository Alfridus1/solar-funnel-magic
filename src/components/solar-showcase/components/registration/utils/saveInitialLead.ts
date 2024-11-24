import { supabase } from "@/integrations/supabase/client";

export const saveInitialLead = async (
  userId: string,
  formData: { 
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  },
  metrics?: any,
  address?: string
) => {
  const { error } = await supabase
    .from('leads')
    .insert([{
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      type: 'calculation',
      metrics,
      address,
      user_id: userId,
      status: 'new'
    }]);

  if (error) throw error;
};