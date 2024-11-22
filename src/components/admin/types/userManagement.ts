export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface AffiliateInfo {
  referral_code?: string;
  referral_count?: number;
  total_leads?: number;
}