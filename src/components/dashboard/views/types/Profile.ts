export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street?: string | null;
  house_number?: string | null;
  postal_code?: string | null;
  city?: string | null;
  annual_consumption?: number | null;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  annual_consumption: string;
}