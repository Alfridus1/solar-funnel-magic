export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
    };
    Enums: {
      user_role:
        | "customer"
        | "sales_employee"
        | "external_sales"
        | "customer_service"
        | "planning"
        | "accountant"
        | "construction_manager"
        | "installation_manager"
        | "installer"
        | "executive"
        | "admin"
        | "sales_team_leader"
        | "sales_director";
    };
  };
}