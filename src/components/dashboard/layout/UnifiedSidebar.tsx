import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { menuItems } from "./config/menuItems";
import { SidebarNav } from "./components/SidebarNav";
import { UserPermission } from "@/types/permissions";

export const UnifiedSidebar = () => {
  const location = useLocation();
  const currentTab = location.hash.replace("#", "") || "dashboard";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>(['customer_access']);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserPermissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/");
          return;
        }

        // Get profile permissions and role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Handle case when profile doesn't exist
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Create a new profile if one doesn't exist
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                first_name: '',
                last_name: '',
                phone: '',
                permissions: ['customer_access'] as UserPermission[],
                role: 'customer'
              });

            if (insertError) {
              console.error('Profile creation error:', insertError);
              toast({
                title: "Fehler beim Erstellen des Profils",
                description: "Bitte versuchen Sie es später erneut",
                variant: "destructive",
              });
              return;
            }

            setUserPermissions(['customer_access']);
            return;
          }

          console.error('Profile fetch error:', profileError);
          toast({
            title: "Fehler beim Laden des Profils",
            description: "Bitte versuchen Sie es später erneut",
            variant: "destructive",
          });
          return;
        }

        // Get employee status if exists
        const { data: employee } = await supabase
          .from('employees')
          .select('role')
          .eq('profile_id', user.id)
          .maybeSingle();

        // Set permissions based on role and employee status
        let permissions = profile?.permissions || ['customer_access'];
        
        // If user is an admin, add all admin permissions
        if (profile?.role === 'admin') {
          permissions = [
            'customer_access',
            'employee_access',
            'admin_access',
            'leads_management',
            'customer_management',
            'project_management',
            'inventory_management',
            'financial_access',
            'employee_management',
            'reporting'
          ] as UserPermission[];
        }
        // If user is an employee, add employee permissions
        else if (employee) {
          permissions = [...new Set([...permissions, 'employee_access'])] as UserPermission[];
        }

        setUserPermissions(permissions);
      } catch (error) {
        console.error('Error loading permissions:', error);
        toast({
          title: "Fehler beim Laden der Berechtigungen",
          description: "Bitte versuchen Sie es später erneut",
          variant: "destructive",
        });
      }
    };

    loadUserPermissions();
  }, [navigate, toast]);

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