import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomerDashboard } from "./CustomerDashboard";
import { EmployeeDashboard } from "./EmployeeDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const UnifiedDashboard = () => {
  const { data: userRole, isLoading, error } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      console.log("Fetching user role...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found");
        throw new Error('Not authenticated');
      }

      console.log("User ID:", user.id);

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, permissions')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Profile Error:", profileError);
          throw profileError;
        }

        console.log("Profile Data:", profile);

        if (profile?.role === 'admin') {
          console.log("User is admin");
          return 'admin';
        }

        const { data: employee, error: employeeError } = await supabase
          .from('employees')
          .select('role')
          .eq('profile_id', user.id)
          .single();

        if (employeeError && employeeError.code !== 'PGRST116') {
          console.error("Employee Error:", employeeError);
        }

        console.log("Employee Data:", employee);

        if (employee?.role) {
          console.log("User is employee");
          return 'employee';
        }

        console.log("User is customer");
        return 'customer';
      } catch (error) {
        console.error('Error fetching user role:', error);
        return 'customer';
      }
    }
  });

  if (error) {
    console.error("Role fetch error:", error);
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  console.log("Final user role:", userRole);

  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    default:
      return <CustomerDashboard />;
  }
};