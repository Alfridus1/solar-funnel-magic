import type { Json } from '../base';

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
      ms_calendar_connected: boolean | null;
      ms_refresh_token: string | null;
      ms_calendar_id: string | null;
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
    Relationships: [
      {
        foreignKeyName: "employees_profile_id_fkey";
        columns: ["profile_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "employees_team_id_fkey";
        columns: ["team_id"];
        isOneToOne: false;
        referencedRelation: "teams";
        referencedColumns: ["id"];
      }
    ];
  };
  employee_devices: {
    Row: {
      created_at: string | null;
      device_name: string;
      device_type: string;
      employee_id: string | null;
      id: string;
      issued_date: string | null;
      notes: string | null;
      return_date: string | null;
      serial_number: string | null;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      device_name: string;
      device_type: string;
      employee_id?: string | null;
      id?: string;
      issued_date?: string | null;
      notes?: string | null;
      return_date?: string | null;
      serial_number?: string | null;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      device_name?: string;
      device_type?: string;
      employee_id?: string | null;
      id?: string;
      issued_date?: string | null;
      notes?: string | null;
      return_date?: string | null;
      serial_number?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "employee_devices_employee_id_fkey";
        columns: ["employee_id"];
        isOneToOne: false;
        referencedRelation: "employees";
        referencedColumns: ["id"];
      }
    ];
  };
  employee_permissions: {
    Row: {
      created_at: string | null;
      employee_id: string | null;
      id: string;
      permissions: Json;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      employee_id?: string | null;
      id?: string;
      permissions?: Json;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      employee_id?: string | null;
      id?: string;
      permissions?: Json;
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
