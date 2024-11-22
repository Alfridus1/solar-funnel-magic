import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from "date-fns";
import { de } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export const LeadSourceChart = () => {
  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['leads-by-source'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const { data, error } = await supabase
        .from('leads')
        .select('created_at, source')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at');

      if (error) throw error;

      // Gruppiere Leads nach Datum und Quelle
      const groupedData = data.reduce((acc: any, lead) => {
        const date = format(new Date(lead.created_at), 'yyyy-MM-dd');
        const source = lead.source || 'Direkt';
        
        if (!acc[date]) {
          acc[date] = {};
        }
        acc[date][source] = (acc[date][source] || 0) + 1;
        return acc;
      }, {});

      // Konvertiere die gruppierten Daten in das Format für das Chart
      const chartData = Object.entries(groupedData).map(([date, sources]: [string, any]) => ({
        date,
        ...sources
      }));

      return chartData;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  // Ermittle alle einzigartigen Quellen
  const sources = leadsData ? Array.from(
    new Set(
      leadsData.flatMap(data => 
        Object.keys(data).filter(key => key !== 'date')
      )
    )
  ) : [];

  // Farben für verschiedene Quellen
  const colors = [
    "#2563eb", // Blau
    "#f59e0b", // Orange
    "#10b981", // Grün
    "#6366f1", // Indigo
    "#ec4899", // Pink
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Lead-Quellen Verlauf</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={leadsData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'd. MMM', { locale: de })}
            />
            <YAxis allowDecimals={false} />
            <Tooltip 
              labelFormatter={(date) => format(new Date(date), 'dd.MM.yyyy', { locale: de })}
              formatter={(value: number, name: string) => [value, `Quelle: ${name}`]}
            />
            <Legend />
            {sources.map((source, index) => (
              <Line
                key={source}
                type="monotone"
                dataKey={source}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                name={source}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};