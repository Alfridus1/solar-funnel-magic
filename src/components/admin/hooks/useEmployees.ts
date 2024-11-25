import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "../types/employee";
import { useNavigate } from "react-router-dom";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast({
          title: "Nicht authentifiziert",
          description: "Bitte melden Sie sich an, um fortzufahren.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Überprüfe, ob der Benutzer ein Admin ist
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.session.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        toast({
          title: "Zugriff verweigert",
          description: "Sie haben keine Berechtigung für den Admin-Bereich.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

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

      setEmployees(transformedData);
    } catch (error: any) {
      console.error('Error in useEmployees:', error);
      toast({
        title: "Fehler beim Laden der Mitarbeiter",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Überprüfe Admin-Rolle beim initialen Laden
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          title: "Zugriff verweigert",
          description: "Sie haben keine Berechtigung für den Admin-Bereich.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      fetchEmployees();
    };

    checkAuthAndFetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (event === 'SIGNED_IN' && session) {
        // Überprüfe Admin-Rolle bei Anmeldung
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role !== 'admin') {
          toast({
            title: "Zugriff verweigert",
            description: "Sie haben keine Berechtigung für den Admin-Bereich.",
            variant: "destructive",
          });
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return { employees, fetchEmployees, isLoading };
};