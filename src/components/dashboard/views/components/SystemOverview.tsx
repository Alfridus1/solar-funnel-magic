import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Sun, TrendingUp, Zap } from "lucide-react";

interface SystemMetric {
  label: string;
  value: string;
  icon: any;
  change?: string;
}

const metrics: SystemMetric[] = [
  {
    label: "Aktuelle Leistung",
    value: "5.2 kW",
    icon: Zap,
    change: "+10% vs. gestern"
  },
  {
    label: "Heutige Produktion",
    value: "25.4 kWh",
    icon: Sun,
    change: "80% des Tagesziels"
  },
  {
    label: "Batteriestand",
    value: "85%",
    icon: Battery,
  },
  {
    label: "Eigenverbrauch",
    value: "68%",
    icon: TrendingUp,
    change: "+5% vs. Vorwoche"
  }
];

export const SystemOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>
                {metric.change && (
                  <p className="text-sm text-green-600 mt-1">{metric.change}</p>
                )}
              </div>
              <metric.icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};