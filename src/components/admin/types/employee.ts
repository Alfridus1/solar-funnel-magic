export type EmployeeRole = 
  | "sales_employee"
  | "customer"
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

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: EmployeeRole;
  team_id?: string;
  profile_id?: string;
  address?: string;
  location?: string;
  iban?: string;
  base_salary?: number;
  commission_enabled?: boolean;
  vacation_days?: number;
  hours_per_month?: number;
  has_company_car?: boolean;
  created_at?: string;
  updated_at?: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    phone: string;
  };
}