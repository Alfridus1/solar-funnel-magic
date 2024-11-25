import type { Json } from '../base';
import type { Database } from '../base';

export interface BaseTables {
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
  };
}