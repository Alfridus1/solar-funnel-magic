import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Crown, 
  Settings,
  MessageSquare
} from "lucide-react";

const menuItems = [
  { 
    label: "Übersicht", 
    icon: LayoutDashboard, 
    value: "overview" 
  },
  { 
    label: "Anfragen", 
    icon: MessageSquare, 
    value: "leads" 
  },
  { 
    label: "Benutzer", 
    icon: Users, 
    value: "users" 
  },
  { 
    label: "Produkte", 
    icon: Package, 
    value: "products" 
  },
  { 
    label: "Premium", 
    icon: Crown, 
    value: "premium" 
  },
  { 
    label: "Einstellungen", 
    icon: Settings, 
    value: "settings" 
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const currentTab = location.hash.replace("#", "") || "overview";

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin
        </h2>
      </div>
      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.value}
              to={`#${item.value}`}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                currentTab === item.value
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
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