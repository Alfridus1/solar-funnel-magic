import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FileText, Package, Star } from "lucide-react";

export const Overview = () => {
  const { data: customersCount, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
      return count || 0;
    }
  });

  const { data: leadsCount, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null);
        
      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }
      return count || 0;
    }
  });

  const { data: productsCount, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('solar_products')
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      return count || 0;
    }
  });

  const { data: premiumProductsCount, isLoading: isLoadingPremium } = useQuery({
    queryKey: ['premium-products-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('premium_products')
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.error('Error fetching premium products:', error);
        throw error;
      }
      return count || 0;
    }
  });

  const stats = [
    {
      title: "Kunden",
      value: customersCount,
      isLoading: isLoadingCustomers,
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Anfragen",
      value: leadsCount,
      isLoading: isLoadingLeads,
      icon: FileText,
      color: "text-green-500"
    },
    {
      title: "Produkte",
      value: productsCount,
      isLoading: isLoadingProducts,
      icon: Package,
      color: "text-orange-500"
    },
    {
      title: "Premium Produkte",
      value: premiumProductsCount,
      isLoading: isLoadingPremium,
      icon: Star,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Übersicht</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  {stat.isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{stat.value}</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};