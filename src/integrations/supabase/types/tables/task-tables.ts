import { Database } from "../base";

export interface TaskTables {
  tasks: {
    Row: {
      id: string;
      title: string;
      description: string | null;
      type_id: string | null;
      document_url: string | null;
      document_name: string | null;
      status: string | null;
      due_date: string | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      title: string;
      description?: string | null;
      type_id?: string | null;
      document_url?: string | null;
      document_name?: string | null;
      status?: string | null;
      due_date?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      title?: string;
      description?: string | null;
      type_id?: string | null;
      document_url?: string | null;
      document_name?: string | null;
      status?: string | null;
      due_date?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "tasks_type_id_fkey";
        columns: ["type_id"];
        isOneToOne: false;
        referencedRelation: "task_types";
        referencedColumns: ["id"];
      }
    ];
  };
  task_types: {
    Row: {
      id: string;
      name: string;
      description: string | null;
      color: string | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      name: string;
      description?: string | null;
      color?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      name?: string;
      description?: string | null;
      color?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [];
  };
}