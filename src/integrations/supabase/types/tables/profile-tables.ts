import type { Database } from '../base';

export interface ProfileTables {
  profiles: {
    Row: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      created_at: string | null;
      updated_at: string | null;
      role: Database["public"]["Enums"]["user_role"] | null;
      street: string | null;
      house_number: string | null;
      postal_code: string | null;
      city: string | null;
      annual_consumption: number | null;
      simulated_role: string | null;
    };
    Insert: {
      id?: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      created_at?: string | null;
      updated_at?: string | null;
      role?: Database["public"]["Enums"]["user_role"] | null;
      street?: string | null;
      house_number?: string | null;
      postal_code?: string | null;
      city?: string | null;
      annual_consumption?: number | null;
      simulated_role?: string | null;
    };
    Update: {
      id?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      created_at?: string | null;
      updated_at?: string | null;
      role?: Database["public"]["Enums"]["user_role"] | null;
      street?: string | null;
      house_number?: string | null;
      postal_code?: string | null;
      city?: string | null;
      annual_consumption?: number | null;
      simulated_role?: string | null;
    };
  };
}