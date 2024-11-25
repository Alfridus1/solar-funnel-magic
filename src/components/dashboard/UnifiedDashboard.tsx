import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { UnifiedSidebar } from "./layout/UnifiedSidebar";

export const UnifiedDashboard = () => {
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

      const { data: employee } = await supabase
        .from('employees')
        .select('role')
        .eq('profile_id', user.id)
        .single();

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

  return (
    <div className="flex h-screen">
      <UnifiedSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Willkommen im Dashboard</h1>
        {/* Content will be rendered based on selected section */}
      </main>
    </div>
  );
};
