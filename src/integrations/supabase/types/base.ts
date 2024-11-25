export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

import { TaskTables } from "./tables/task-tables";
import { Tables } from "./tables";

export interface Database {
  public: {
    Tables: Tables & TaskTables;
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_commission: {
        Args: {
          purchase_amount: number;
          commission_percentage: number;
        };
        Returns: number;
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}