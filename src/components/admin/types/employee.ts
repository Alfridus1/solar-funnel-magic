export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
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
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}