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
  };
}