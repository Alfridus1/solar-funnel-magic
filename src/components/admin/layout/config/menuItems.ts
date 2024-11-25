import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Package, 
  Settings, 
  ListTodo,
  Crown,
  Shield,
  UserPlus,
  Bug,
  Megaphone
} from "lucide-react";
import { MenuItem } from "../types";

export const adminMenuItems: MenuItem[] = [
  { 
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/admin/dashboard"
  },
  { 
    icon: Users,
    label: "Benutzer",
    path: "/admin/users"
  },
  { 
    icon: UserPlus,
    label: "Leads",
    path: "/admin/leads"
  },
  { 
    icon: Shield,
    label: "Rollen",
    path: "/admin/roles"
  },
  { 
    icon: Bug,
    label: "API Debug",
    path: "/admin/api-debug"
  },
  { 
    icon: Crown,
    label: "Partner",
    path: "/admin/affiliates"
  },
  { 
    icon: UserCog,
    label: "Mitarbeiter",
    path: "/admin/employees"
  },
  { 
    icon: Megaphone,
    label: "Marketing",
    path: "/admin/marketing"
  },
  { 
    icon: Package,
    label: "Produkte",
    path: "/admin/products"
  },
  { 
    icon: Settings,
    label: "Einstellungen",
    path: "/admin/settings"
  }
];