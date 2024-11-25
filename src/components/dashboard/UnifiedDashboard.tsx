import { useEffect, useState } from "react";
import { CustomerDashboard } from "./CustomerDashboard";
import { EmployeeDashboard } from "./EmployeeDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const UnifiedDashboard = () => {
  const { data: userRoles, isLoading } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        return {
          isAdmin: profile?.role === 'admin',
          isEmployee: profile?.role === 'sales_employee' || 
                     profile?.role === 'external_sales' || 
                     profile?.role === 'customer_service' ||
                     profile?.role === 'planning' ||
                     profile?.role === 'accountant' ||
                     profile?.role === 'construction_manager' ||
                     profile?.role === 'installation_manager' ||
                     profile?.role === 'installer' ||
                     profile?.role === 'executive' ||
                     profile?.role === 'sales_team_leader' ||
                     profile?.role === 'sales_director',
          role: profile?.role
        };
      } catch (error) {
        console.error('Error fetching user roles:', error);
        return {
          isAdmin: false,
          isEmployee: false,
          role: 'customer'
        };
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="customer">
          <AccordionTrigger>Kundenbereich</AccordionTrigger>
          <AccordionContent>
            <CustomerDashboard />
          </AccordionContent>
        </AccordionItem>

        {userRoles?.isEmployee && (
          <AccordionItem value="employee">
            <AccordionTrigger>Mitarbeiterbereich</AccordionTrigger>
            <AccordionContent>
              <EmployeeDashboard />
            </AccordionContent>
          </AccordionItem>
        )}

        {userRoles?.isAdmin && (
          <AccordionItem value="admin">
            <AccordionTrigger>Administrationsbereich</AccordionTrigger>
            <AccordionContent>
              <AdminDashboard />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};