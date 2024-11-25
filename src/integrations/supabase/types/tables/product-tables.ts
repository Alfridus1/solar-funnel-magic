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
  premium_products: {
    Row: {
      id: string;
      name: string;
      description: string;
      image_url: string;
      features: string[];
      climate_impact: string;
      order_number: number;
      created_at: string | null;
      updated_at: string | null;
      purchase_options: Json | null;
      inclusion_type: string;
    };
    Insert: {
      id?: string;
      name: string;
      description: string;
      image_url: string;
      features?: string[];
      climate_impact: string;
      order_number: number;
      created_at?: string | null;
      updated_at?: string | null;
      purchase_options?: Json | null;
      inclusion_type?: string;
    };
    Update: {
      id?: string;
      name?: string;
      description?: string;
      image_url?: string;
      features?: string[];
      climate_impact?: string;
      order_number?: number;
      created_at?: string | null;
      updated_at?: string | null;
      purchase_options?: Json | null;
      inclusion_type?: string;
    };
  };
}