import type { Json } from '../base';
import type { Database } from '../base';

export interface BaseTables {
  employee_permissions: {
    Row: {
      id: string;
      employee_id: string | null;
      permissions: Json;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      employee_id?: string | null;
      permissions?: Json;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      employee_id?: string | null;
      permissions?: Json;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "employee_permissions_employee_id_fkey";
        columns: ["employee_id"];
        isOneToOne: true;
        referencedRelation: "employees";
        referencedColumns: ["id"];
      }
    ];
  };
}