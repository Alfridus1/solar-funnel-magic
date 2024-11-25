import type { Json } from '../base';

export interface ProjectTables {
  projects: {
    Row: {
      id: string;
      title: string;
      customer_name: string;
      address: string;
      status: string;
      start_date: string | null;
      completion_date: string | null;
      team_id: string | null;
      created_at: string | null;
      updated_at: string | null;
      customer_id: string | null;
      project_type: string;
      system_size: number | null;
      site_conditions: string | null;
      special_requirements: string | null;
      estimated_completion_date: string | null;
      subtype: string | null;
      customer_email: string | null;
      customer_phone: string | null;
    };
    Insert: {
      id?: string;
      title: string;
      customer_name: string;
      address: string;
      status: string;
      start_date?: string | null;
      completion_date?: string | null;
      team_id?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      customer_id?: string | null;
      project_type: string;
      system_size?: number | null;
      site_conditions?: string | null;
      special_requirements?: string | null;
      estimated_completion_date?: string | null;
      subtype?: string | null;
      customer_email?: string | null;
      customer_phone?: string | null;
    };
    Update: {
      id?: string;
      title?: string;
      customer_name?: string;
      address?: string;
      status?: string;
      start_date?: string | null;
      completion_date?: string | null;
      team_id?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      customer_id?: string | null;
      project_type?: string;
      system_size?: number | null;
      site_conditions?: string | null;
      special_requirements?: string | null;
      estimated_completion_date?: string | null;
      subtype?: string | null;
      customer_email?: string | null;
      customer_phone?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "projects_customer_id_fkey";
        columns: ["customer_id"];
        isOneToOne: false;
        referencedRelation: "customers";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "projects_team_id_fkey";
        columns: ["team_id"];
        isOneToOne: false;
        referencedRelation: "teams";
        referencedColumns: ["id"];
      }
    ];
  };
  project_notes: {
    Row: {
      id: string;
      project_id: string;
      content: string;
      created_at: string | null;
      created_by: string;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      project_id: string;
      content: string;
      created_at?: string | null;
      created_by: string;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      project_id?: string;
      content?: string;
      created_at?: string | null;
      created_by?: string;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "project_notes_project_id_fkey";
        columns: ["project_id"];
        isOneToOne: false;
        referencedRelation: "projects";
        referencedColumns: ["id"];
      }
    ];
  };
  project_documentation: {
    Row: {
      id: string;
      file_path: string;
      notes: string | null;
      project_id: string | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      file_path: string;
      notes?: string | null;
      project_id?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      file_path?: string;
      notes?: string | null;
      project_id?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "project_documentation_project_id_fkey";
        columns: ["project_id"];
        isOneToOne: false;
        referencedRelation: "projects";
        referencedColumns: ["id"];
      }
    ];
  };
}
