import { z } from "zod";

export const employeeFormSchema = z.object({
  first_name: z.string().min(1, "Vorname wird benötigt"),
  last_name: z.string().min(1, "Nachname wird benötigt"),
  email: z.string().email("Ungültige Email-Adresse"),
  role: z.enum([
    "customer",
    "sales_employee",
    "external_sales", 
    "customer_service",
    "planning",
    "accountant",
    "construction_manager",
    "installation_manager",
    "installer",
    "executive",
    "admin",
    "sales_team_leader",
    "sales_director"
  ]),
  phone: z.string().optional(),
  address: z.string().optional(),
  location: z.string().optional(),
  iban: z.string().optional(),
  base_salary: z.number().optional(),
  commission_enabled: z.boolean().optional(),
  vacation_days: z.number().optional(),
  hours_per_month: z.number().optional(),
  has_company_car: z.boolean().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
export type EmployeeProfileData = EmployeeFormData;