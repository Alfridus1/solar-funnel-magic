import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Inbox,
  LayoutGrid,
  Award,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    value: "dashboard" 
  },
  { 
    label: "Meine Anfragen", 
    icon: Inbox, 
    value: "requests" 
  },
  { 
    label: "Meine Projekte", 
    icon: LayoutGrid, 
    value: "projects" 
  },
  { 
    label: "Empfehlungsprogramm", 
    icon: Award, 
    value: "referral" 
  },
  { 
    label: "Dokumente", 
    icon: FileText, 
    value: "documents" 
  },
  { 
    label: "Einstellungen", 
    icon: Settings, 
    value: "settings" 
  },
];

export const CustomerSidebar = () => {
  const location = useLocation();
  const currentTab = location.hash.replace("#", "") || "dashboard";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Fehler beim Ausloggen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    navigate("/");
  };

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
          {isCollapsed ? "D" : "Dashboard"}
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
    </div>
  );
};