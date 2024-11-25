import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { menuItems } from "./config/menuItems";
import { SidebarNav } from "./components/SidebarNav";

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

      <SidebarNav
        menuItems={menuItems}
        userPermissions={userPermissions}
        currentTab={currentTab}
        isCollapsed={isCollapsed}
        handleLogout={handleLogout}
      />
    </div>
  );
};