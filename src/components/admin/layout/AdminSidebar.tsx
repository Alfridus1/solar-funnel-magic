import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Crown, 
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  UserCog,
  ListTodo
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { 
    label: "Übersicht", 
    icon: LayoutDashboard, 
    value: "overview",
    path: "/admin#overview"
  },
  { 
    label: "Anfragen", 
    icon: MessageSquare, 
    value: "leads",
    path: "/admin#leads"
  },
  { 
    label: "Benutzer", 
    icon: Users, 
    value: "users",
    path: "/admin#users"
  },
  { 
    label: "Affiliates", 
    icon: UserPlus, 
    value: "affiliates",
    path: "/admin#affiliates"
  },
  { 
    label: "Mitarbeiter", 
    icon: UserCog, 
    value: "employees",
    path: "/admin#employees"
  },
  { 
    label: "Produkte", 
    icon: Package, 
    value: "products",
    path: "/admin#products"
  },
  { 
    label: "Aufgabentypen", 
    icon: ListTodo, 
    value: "task-types",
    path: "/admin#task-types"
  },
  { 
    label: "Premium", 
    icon: Crown, 
    value: "premium",
    path: "/admin#premium"
  },
  { 
    label: "Einstellungen", 
    icon: Settings, 
    value: "settings",
    path: "/admin#settings"
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const currentTab = location.hash.replace("#", "") || "overview";
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="p-6">
        <h2 className={cn(
          "text-2xl font-bold text-gray-800 dark:text-white transition-all duration-300",
          isCollapsed && "text-center text-xl"
        )}>
          {isCollapsed ? "A" : "Admin"}
        </h2>
      </div>

      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.value}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                currentTab === item.value
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className={cn(
                "transition-all duration-300",
                isCollapsed && "hidden"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};