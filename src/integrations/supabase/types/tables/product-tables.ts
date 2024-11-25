import type { Json } from '../base';

export interface ProductTables {
  solar_products: {
    Row: {
      id: string;
      name: string;
      category: string;
      price: number;
      specs: Json;
      created_at: string | null;
      updated_at: string | null;
      datasheet_url: string | null;
    };
    Insert: {
      id?: string;
      name: string;
      category: string;
      price: number;
      specs: Json;
      created_at?: string | null;
      updated_at?: string | null;
      datasheet_url?: string | null;
    };
    Update: {
      id?: string;
      name?: string;
      category?: string;
      price?: number;
      specs?: Json;
      created_at?: string | null;
      updated_at?: string | null;
      datasheet_url?: string | null;
    };
  };
}