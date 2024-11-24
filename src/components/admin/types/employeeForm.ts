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

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;