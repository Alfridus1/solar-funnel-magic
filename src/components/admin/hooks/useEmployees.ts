import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "../types/employee";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email,
            phone,
            role
          )
        `);

      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }

      if (!data) {
        setEmployees([]);
        return;
      }

      const transformedData: Employee[] = data.map(employee => ({
        id: employee.id,
        first_name: employee.profiles?.first_name || '',
        last_name: employee.profiles?.last_name || '',
        email: employee.profiles?.email || '',
        role: employee.role as Employee['role'],
        team_id: employee.team_id,
        profile_id: employee.profile_id,
        address: employee.address,
        location: employee.location,
        iban: employee.iban,
        base_salary: employee.base_salary,
        commission_enabled: employee.commission_enabled,
        vacation_days: employee.vacation_days,
        hours_per_month: employee.hours_per_month,
        has_company_car: employee.has_company_car,
        created_at: employee.created_at,
        updated_at: employee.updated_at,
        profiles: employee.profiles ? {
          first_name: employee.profiles.first_name,
          last_name: employee.profiles.last_name,
          email: employee.profiles.email,
          role: employee.profiles.role,
          phone: employee.profiles.phone
        } : undefined
      }));

      console.log('Fetched employees:', transformedData);
      setEmployees(transformedData);
    } catch (error: any) {
      console.error('Error in useEmployees:', error);
      toast({
        title: "Fehler beim Laden der Mitarbeiter",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees, fetchEmployees };
};