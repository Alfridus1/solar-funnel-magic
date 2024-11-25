import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  Package,
  Settings,
  UserCog,
  BadgeCheck,
  CheckSquare,
  Crown,
  ShieldCheck
} from "lucide-react";

const menuItems = [
  { 
    label: "Übersicht", 
    icon: LayoutDashboard, 
    path: "/admin#overview" 
  },
  { 
    label: "Leads", 
    icon: FileText, 
    path: "/admin#leads" 
  },
  { 
    label: "Benutzer", 
    icon: Users, 
    path: "/admin#users" 
  },
  { 
    label: "Partner", 
    icon: BadgeCheck, 
    path: "/admin#affiliates" 
  },
  { 
    label: "Mitarbeiter", 
    icon: UserCog, 
    path: "/admin#employees" 
  },
  { 
    label: "Produkte", 
    icon: Package, 
    path: "/admin#products" 
  },
  { 
    label: "Aufgabentypen", 
    icon: CheckSquare, 
    path: "/admin#task-types" 
  },
  { 
    label: "Premium Produkte", 
    icon: Crown, 
    path: "/admin#premium" 
  },
  { 
    label: "Administratoren", 
    icon: ShieldCheck, 
    path: "/admin#admins" 
  },
  { 
    label: "Einstellungen", 
    icon: Settings, 
    path: "/admin#settings" 
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname + location.hash;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin</h2>
      </div>
      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                currentPath === item.path
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};