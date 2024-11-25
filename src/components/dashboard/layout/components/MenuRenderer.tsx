import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { MenuItem } from "../types";

interface MenuRendererProps {
  menuItems: MenuItem[];
  userPermissions: string[];
  currentTab: string;
  isCollapsed: boolean;
  handleLogout: () => void;
}

export const renderMenu = ({
  menuItems,
  userPermissions,
  currentTab,
  isCollapsed,
  handleLogout
}: MenuRendererProps) => {
  const filteredMenuItems = menuItems.filter(item => 
    userPermissions.includes(item.requiredPermission)
  );

  return (
    <nav className="space-y-1 px-3">
      {filteredMenuItems.map((item) => {
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
            <span className={cn(
              "transition-all duration-300",
              isCollapsed && "hidden"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className="flex w-full items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
      >
        <LogOut className="h-5 w-5 mr-3" />
        <span className={cn(
          "transition-all duration-300",
          isCollapsed && "hidden"
        )}>
          Ausloggen
        </span>
      </button>
    </nav>
  );
};