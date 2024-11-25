import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Inbox,
  LayoutGrid,
  Award,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
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
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  label: string;
  icon: any;
  value: string;
  requiredPermission: string;
}

const menuItems: MenuItem[] = [
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

// Since this file is too long, let's extract the menu rendering logic
import { renderMenu } from "./components/MenuRenderer";

export const UnifiedSidebar = () => {
  const location = useLocation();
  const currentTab = location.hash.replace("#", "") || "dashboard";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserPermissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get both profile permissions and employee permissions
        const { data: profile } = await supabase
          .from('profiles')
          .select('permissions')
          .eq('id', user.id)
          .single();
        
        const { data: employee } = await supabase
          .from('employees')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        let permissions = profile?.permissions || [];
        
        // If user is an employee, add employee permissions
        if (employee) {
          permissions.push('employee_access');
        }

        setUserPermissions(permissions);
      }
    };

    loadUserPermissions();
  }, []);

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

      {renderMenu({
        menuItems,
        userPermissions,
        currentTab,
        isCollapsed,
        handleLogout
      })}
    </div>
  );
};