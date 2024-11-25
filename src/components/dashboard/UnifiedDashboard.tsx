import { useEffect } from "react";
import { CustomerDashboard } from "./CustomerDashboard";
import { EmployeeDashboard } from "./EmployeeDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const UnifiedDashboard = () => {
  const { data: userRoles, isLoading } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, permissions')
          .eq('id', user.id)
          .maybeSingle();

        const { data: employee } = await supabase
          .from('employees')
          .select('role')
          .eq('profile_id', user.id)
          .maybeSingle();

        return {
          isAdmin: profile?.role === 'admin',
          isEmployee: !!employee?.role,
          permissions: profile?.permissions || ['customer_access']
        };
      } catch (error) {
        console.error('Error fetching user roles:', error);
        return {
          isAdmin: false,
          isEmployee: false,
          permissions: ['customer_access']
        };
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

  return (
    <div className="flex flex-col gap-8">
      <CustomerDashboard />
      {userRoles?.isEmployee && <EmployeeDashboard />}
      {userRoles?.isAdmin && <AdminDashboard />}
    </div>
  );
};