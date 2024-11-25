import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LeadSourceChart } from "./LeadSourceChart";
import { EmployeeSimulator } from "./EmployeeSimulator";

export const Overview = () => {
  const { data: leadsCount } = useQuery({
    queryKey: ['leads-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: usersCount } = useQuery({
    queryKey: ['users-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: employeesCount } = useQuery({
    queryKey: ['employees-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <EmployeeSimulator />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-500">Leads</h3>
          <p className="text-3xl font-bold">{leadsCount || 0}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-gray-500">Benutzer</h3>
          <p className="text-3xl font-bold">{usersCount || 0}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-gray-500">Mitarbeiter</h3>
          <p className="text-3xl font-bold">{employeesCount || 0}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Lead-Quellen</h2>
        <LeadSourceChart />
      </Card>
    </div>
  );
};