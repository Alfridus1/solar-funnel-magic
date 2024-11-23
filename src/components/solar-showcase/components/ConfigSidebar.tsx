import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  FolderGit2, 
  Award, 
  Files, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    path: "/dashboard" 
  },
  { 
    label: "Meine Anfragen", 
    icon: FileText, 
    path: "/dashboard#requests" 
  },
  { 
    label: "Meine Projekte", 
    icon: FolderGit2, 
    path: "/dashboard#projects" 
  },
  { 
    label: "Empfehlungsprogramm", 
    icon: Award, 
    path: "/dashboard#referral" 
  },
  { 
    label: "Dokumente", 
    icon: Files, 
    path: "/dashboard#documents" 
  },
  { 
    label: "Einstellungen", 
    icon: Settings, 
    path: "/dashboard#settings" 
  },
];

export const ConfigSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-screen",
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
          {isCollapsed ? "Menu" : "Menü"}
        </h2>
      </div>

      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
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
          onClick={() => {/* Add logout logic here */}}
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
    </div>
  );
};