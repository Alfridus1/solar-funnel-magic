import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { UnifiedSidebar } from "./layout/UnifiedSidebar";
import { CustomerDashboard } from "./CustomerDashboard";
import { EmployeeDashboard } from "./EmployeeDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { useLocation } from "react-router-dom";

export const UnifiedDashboard = () => {
  const location = useLocation();
  const section = location.pathname.split('/')[2] || 'customer'; // Default to customer

  const { data: userRoles, isLoading } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // Changed to handle no employee record case
      const { data: employees } = await supabase
        .from('employees')
        .select('role')
        .eq('profile_id', user.id);

      const employee = employees?.[0]; // Get first employee if exists

      return {
        isAdmin: profile?.role === 'admin',
        isEmployee: !!employee || profile?.role === 'admin'
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (section) {
      case 'admin':
        return userRoles?.isAdmin ? <AdminDashboard /> : null;
      case 'employee':
        return userRoles?.isEmployee ? <EmployeeDashboard /> : null;
      case 'customer':
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      <UnifiedSidebar userRoles={userRoles} />
      <main className="flex-1 overflow-y-auto p-8">
        {renderDashboard()}
      </main>
    </div>
  );
};