import { Database } from "@/integrations/supabase/types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole | null;
}

export interface AffiliateInfo {
  referral_code?: string;
  referral_count?: number;
  total_leads?: number;
}