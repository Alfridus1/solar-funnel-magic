import { Card } from "@/components/ui/card";
import { Users, MessageSquare, Package, Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadSourceChart } from "./LeadSourceChart";

const StatCard = ({ label, value, icon: Icon, change, isLoading }: {
  label: string;
  value: string;
  icon: any;
  change?: string;
  isLoading?: boolean;
}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {label}
        </p>
        {isLoading ? (
          <Skeleton className="h-8 w-24 mt-2" />
        ) : (
          <>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {change && <p className="text-sm text-green-600 mt-1">{change}</p>}
          </>
        )}
      </div>
      <Icon className="h-8 w-8 text-muted-foreground" />
    </div>
  </Card>
);

export const Overview = () => {
  const { data: customersCount, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: leadsCount, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: productsCount, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('solar_products')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: premiumProductsCount, isLoading: isLoadingPremium } = useQuery({
    queryKey: ['premium-products-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('premium_products')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const stats = [
    {
      label: "Aktive Benutzer",
      value: customersCount?.toString() || "0",
      icon: Users,
      isLoading: isLoadingCustomers
    },
    {
      label: "Neue Anfragen",
      value: leadsCount?.toString() || "0",
      icon: MessageSquare,
      isLoading: isLoadingLeads
    },
    {
      label: "Produkte",
      value: productsCount?.toString() || "0",
      icon: Package,
      isLoading: isLoadingProducts
    },
    {
      label: "Premium Produkte",
      value: premiumProductsCount?.toString() || "0",
      icon: Crown,
      isLoading: isLoadingPremium
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            isLoading={stat.isLoading}
          />
        ))}
      </div>

      <LeadSourceChart />
    </div>
  );
};