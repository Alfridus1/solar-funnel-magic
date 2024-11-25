import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomerDashboard } from "./CustomerDashboard";
import { EmployeeDashboard } from "./EmployeeDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const UnifiedDashboard = () => {
  const { data: userRole, isLoading } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        const { data: employee } = await supabase
          .from('employees')
          .select('role')
          .eq('profile_id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin') return 'admin';
        if (employee?.role) return 'employee';
        return 'customer';
      } catch (error) {
        console.error('Error fetching user role:', error);
        return 'customer';
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    default:
      return <CustomerDashboard />;
  }
};