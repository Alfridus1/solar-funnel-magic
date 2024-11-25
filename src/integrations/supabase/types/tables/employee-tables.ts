export interface EmployeeTables {
  employees: {
    Row: {
      id: string;
      personio_id: string | null;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      team_id: string | null;
      created_at: string | null;
      updated_at: string | null;
      profile_id: string | null;
      address: string | null;
      location: string | null;
      iban: string | null;
      base_salary: number | null;
      commission_enabled: boolean | null;
      vacation_days: number | null;
      hours_per_month: number | null;
      has_company_car: boolean | null;
    };
    Insert: {
      id?: string;
      personio_id?: string | null;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      team_id?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      profile_id?: string | null;
      address?: string | null;
      location?: string | null;
      iban?: string | null;
      base_salary?: number | null;
      commission_enabled?: boolean | null;
      vacation_days?: number | null;
      hours_per_month?: number | null;
      has_company_car?: boolean | null;
    };
    Update: {
      id?: string;
      personio_id?: string | null;
      first_name?: string;
      last_name?: string;
      email?: string;
      role?: string;
      team_id?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      profile_id?: string | null;
      address?: string | null;
      location?: string | null;
      iban?: string | null;
      base_salary?: number | null;
      commission_enabled?: boolean | null;
      vacation_days?: number | null;
      hours_per_month?: number | null;
      has_company_car?: boolean | null;
    };
  };
  employee_devices: {
    Row: {
      id: string;
      employee_id: string | null;
      device_type: string;
      device_name: string;
      serial_number: string | null;
      issued_date: string | null;
      return_date: string | null;
      notes: string | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      employee_id?: string | null;
      device_type: string;
      device_name: string;
      serial_number?: string | null;
      issued_date?: string | null;
      return_date?: string | null;
      notes?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      employee_id?: string | null;
      device_type?: string;
      device_name?: string;
      serial_number?: string | null;
      issued_date?: string | null;
      return_date?: string | null;
      notes?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
  };
}