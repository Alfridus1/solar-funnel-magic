import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ChartSkeleton } from "./charts/ChartSkeleton";
import { useLeadsData } from "./charts/useLeadsData";

const CHART_COLORS = [
  "#2563eb", // Blau
  "#f59e0b", // Orange
  "#10b981", // Grün
  "#6366f1", // Indigo
  "#ec4899", // Pink
];

export const LeadSourceChart = () => {
  const { data: leadsData, isLoading } = useLeadsData();

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const sources = leadsData ? Array.from(
    new Set(
      leadsData.flatMap(data => 
        Object.keys(data).filter(key => key !== 'date')
      )
    )
  ) : [];

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
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
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