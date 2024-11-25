import { 
  LayoutDashboard, 
  Inbox,
  LayoutGrid,
  Award,
  FileText,
  Settings,
  User,
  Users,
  Package,
  CheckSquare,
  Crown,
  ShieldCheck,
  Cog,
  Clock,
  Calendar
} from "lucide-react";
import { MenuItem } from "../types";

export const menuItems: MenuItem[] = [
  // Customer menu items
  { 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    value: "dashboard",
    requiredPermission: "customer_access"
  },
  { 
    label: "Meine Anfragen", 
    icon: Inbox, 
    value: "requests",
    requiredPermission: "customer_access"
  },
  { 
    label: "Meine Projekte", 
    icon: LayoutGrid, 
    value: "projects",
    requiredPermission: "customer_access"
  },
  { 
    label: "Empfehlungsprogramm", 
    icon: Award, 
    value: "referral",
    requiredPermission: "customer_access"
  },
  { 
    label: "Dokumente", 
    icon: FileText, 
    value: "documents",
    requiredPermission: "customer_access"
  },
  {
    label: "Mein Profil",
    icon: User,
    value: "profile",
    requiredPermission: "customer_access"
  },
  // Employee menu items
  { 
    label: "Aufgaben", 
    icon: CheckSquare, 
    value: "tasks",
    requiredPermission: "employee_access"
  },
  { 
    label: "Kalender", 
    icon: Calendar, 
    value: "calendar",
    requiredPermission: "employee_access"
  },
  { 
    label: "Zeiterfassung", 
    icon: Clock, 
    value: "time",
    requiredPermission: "employee_access"
  },
  { 
    label: "Team", 
    icon: Users, 
    value: "team",
    requiredPermission: "employee_access"
  },
  // Admin menu items
  { 
    label: "Leads", 
    icon: FileText, 
    value: "leads",
    requiredPermission: "leads_management"
  },
  { 
    label: "Benutzer", 
    icon: Users, 
    value: "users",
    requiredPermission: "customer_management"
  },
  { 
    label: "Partner", 
    icon: Award, 
    value: "affiliates",
    requiredPermission: "admin_access"
  },
  { 
    label: "Mitarbeiter", 
    icon: Users, 
    value: "employees",
    requiredPermission: "employee_management"
  },
  { 
    label: "Produkte", 
    icon: Package, 
    value: "products",
    requiredPermission: "inventory_management"
  },
  { 
    label: "Aufgabentypen", 
    icon: CheckSquare, 
    value: "task-types",
    requiredPermission: "admin_access"
  },
  { 
    label: "Premium Produkte", 
    icon: Crown, 
    value: "premium",
    requiredPermission: "admin_access"
  },
  { 
    label: "Administratoren", 
    icon: ShieldCheck, 
    value: "admins",
    requiredPermission: "admin_access"
  },
  { 
    label: "Einstellungen", 
    icon: Settings, 
    value: "settings",
    requiredPermission: "customer_access"
  },
  { 
    label: "System Einstellungen", 
    icon: Cog, 
    value: "system-settings",
    requiredPermission: "admin_access"
  },
];