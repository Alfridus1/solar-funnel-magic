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
  phone: z.string().min(1, "Telefonnummer wird benötigt"),
});

export const employeeProfileSchema = z.object({
  address: z.string().min(1, "Adresse wird benötigt"),
  location: z.string().min(1, "Standort wird benötigt"),
  iban: z.string().min(1, "IBAN wird benötigt"),
  base_salary: z.string().min(1, "Fixgehalt wird benötigt"),
  commission_enabled: z.boolean(),
  vacation_days: z.string().min(1, "Urlaubstage werden benötigt"),
  hours_per_month: z.string().min(1, "Arbeitsstunden pro Monat werden benötigt"),
  has_company_car: z.boolean(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
export type EmployeeProfileData = z.infer<typeof employeeProfileSchema>;