import { EmployeeRole } from "../../types/employee";

export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  role: EmployeeRole;
}

export interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  role: EmployeeRole;
  phone: string;
}