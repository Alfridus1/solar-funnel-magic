import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Package,
  Settings,
  FileText,
  Award,
  UserCog,
  Bug,
  ShieldCheck,
  Layout,
  Boxes
} from "lucide-react";

const menuItems = [
  {
    label: "Übersicht",
    icon: LayoutDashboard,
    href: "#overview"
  },
  {
    label: "Leads",
    icon: FileText,
    href: "#leads"
  },
  {
    label: "Benutzer",
    icon: Users,
    href: "#users"
  },
  {
    label: "Affiliates",
    icon: Award,
    href: "#affiliates"
  },
  {
    label: "Mitarbeiter",
    icon: UserCircle,
    href: "#employees"
  },
  {
    label: "Produkte",
    icon: Package,
    href: "#products"
  },
  {
    label: "Premium Produkte",
    icon: Boxes,
    href: "#premium"
  },
  {
    label: "Landing Page",
    icon: Layout,
    href: "#landing-page"
  },
  {
    label: "Administratoren",
    icon: UserCog,
    href: "#admins"
  },
  {
    label: "Rollen & Rechte",
    icon: ShieldCheck,
    href: "#roles"
  },
  {
    label: "API Debug",
    icon: Bug,
    href: "#api-debug"
  },
  {
    label: "Einstellungen",
    icon: Settings,
    href: "#settings"
  }
];

export const AdminSidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
      </div>
      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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