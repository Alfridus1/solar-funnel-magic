import { Award, Users, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Stats = () => {
  const { data: stats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: async () => {
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null);

      const { count: totalEmployees } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });

      const { count: totalCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      return {
        totalLeads: totalLeads || 0,
        totalEmployees: totalEmployees || 0,
        totalCustomers: totalCustomers || 0,
      };
    },
    initialData: {
      totalLeads: 0,
      totalEmployees: 0,
      totalCustomers: 0,
    }
  });

  return (
    <div className="py-16 bg-white/80 backdrop-blur rounded-2xl my-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <Award className="h-12 w-12 text-solar-orange mb-2" />
          <h3 className="text-4xl font-bold text-gray-900">
            {stats.totalCustomers.toLocaleString('de-DE')}+
          </h3>
          <p className="text-gray-600">Zufriedene Kunden</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-2">
          <Users className="h-12 w-12 text-solar-orange mb-2" />
          <h3 className="text-4xl font-bold text-gray-900">
            {stats.totalEmployees.toLocaleString('de-DE')}+
          </h3>
          <p className="text-gray-600">Experten im Team</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-2">
          <CheckCircle className="h-12 w-12 text-solar-orange mb-2" />
          <h3 className="text-4xl font-bold text-gray-900">98%</h3>
          <p className="text-gray-600">Weiterempfehlungsrate</p>
        </div>
      </div>
    </div>
  );
};