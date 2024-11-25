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
    path: "/dashboard/admin#overview"
  },
  { 
    icon: Users,
    label: "Benutzer",
    path: "/dashboard/admin#users"
  },
  { 
    icon: UserPlus,
    label: "Leads",
    path: "/dashboard/admin#leads"
  },
  { 
    icon: Shield,
    label: "Rollen",
    path: "/dashboard/admin#roles"
  },
  { 
    icon: Bug,
    label: "API Debug",
    path: "/dashboard/admin#api-debug"
  },
  { 
    icon: Crown,
    label: "Partner",
    path: "/dashboard/admin#affiliates"
  },
  { 
    icon: UserCog,
    label: "Mitarbeiter",
    path: "/dashboard/admin#employees"
  },
  { 
    icon: Megaphone,
    label: "Marketing",
    path: "/dashboard/admin#marketing"
  },
  { 
    icon: Package,
    label: "Produkte",
    path: "/dashboard/admin#products"
  },
  { 
    icon: Settings,
    label: "Einstellungen",
    path: "/dashboard/admin#settings"
  }
];