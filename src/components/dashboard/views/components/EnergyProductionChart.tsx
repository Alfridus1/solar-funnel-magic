import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ProductionData {
  month: string;
  production: number;
}

interface LeadMetrics {
  monthlyProductionHistory?: ProductionData[];
  [key: string]: any;
}

export const EnergyProductionChart = () => {
  const { data: productionData, isLoading } = useQuery({
    queryKey: ['energy-production'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: lead } = await supabase
        .from('leads')
        .select('metrics')
        .eq('user_id', user.id)
        .single();

      const metrics = lead?.metrics as LeadMetrics | null;
      return metrics?.monthlyProductionHistory || [];
    }
  });

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!productionData || productionData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Keine Produktionsdaten verfügbar
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={productionData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="production" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};