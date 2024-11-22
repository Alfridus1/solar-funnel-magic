import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";

export const useLeadsData = () => {
  return useQuery({
    queryKey: ['leads-by-source'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const { data, error } = await supabase
        .from('leads')
        .select('created_at, source')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at');

      if (error) throw error;

      const groupedData = data.reduce((acc: any, lead) => {
        const date = format(new Date(lead.created_at), 'yyyy-MM-dd');
        const source = lead.source || 'Direkt';
        
        if (!acc[date]) {
          acc[date] = {};
        }
        acc[date][source] = (acc[date][source] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(groupedData).map(([date, sources]: [string, any]) => ({
        date,
        ...sources
      }));
    }
  });
};