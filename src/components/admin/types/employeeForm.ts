import { z } from "zod";

export const employeeFormSchema = z.object({
  first_name: z.string().min(1, "Vorname wird benötigt"),
  last_name: z.string().min(1, "Nachname wird benötigt"),
  email: z.string().email("Ungültige Email-Adresse"),
  phone: z.string().optional(),
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
  address: z.string().optional(),
  location: z.string().optional(),
  iban: z.string().optional(),
  base_salary: z.number().min(0).default(0),
  commission_enabled: z.boolean().default(false),
  vacation_days: z.number().min(0).default(30),
  hours_per_month: z.number().min(0).default(160),
  has_company_car: z.boolean().default(false),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;