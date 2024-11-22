import { Card } from "@/components/ui/card";
import { Users, MessageSquare, Package, Crown } from "lucide-react";

const stats = [
  {
    label: "Aktive Benutzer",
    value: "1,234",
    icon: Users,
    change: "+12%",
  },
  {
    label: "Neue Anfragen",
    value: "45",
    icon: MessageSquare,
    change: "+23%",
  },
  {
    label: "Produkte",
    value: "89",
    icon: Package,
    change: "+4%",
  },
  {
    label: "Premium Kunden",
    value: "412",
    icon: Crown,
    change: "+18%",
  },
];

export const Overview = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};