import type { Json } from '../base';

export interface InventoryTables {
  inventory: {
    Row: {
      id: string;
      warehouse_id: string | null;
      product_id: string | null;
      quantity: number;
      minimum_quantity: number;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      warehouse_id?: string | null;
      product_id?: string | null;
      quantity: number;
      minimum_quantity: number;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      warehouse_id?: string | null;
      product_id?: string | null;
      quantity?: number;
      minimum_quantity?: number;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "inventory_product_id_fkey";
        columns: ["product_id"];
        isOneToOne: false;
        referencedRelation: "solar_products";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "inventory_warehouse_id_fkey";
        columns: ["warehouse_id"];
        isOneToOne: false;
        referencedRelation: "warehouses";
        referencedColumns: ["id"];
      }
    ];
  };
}