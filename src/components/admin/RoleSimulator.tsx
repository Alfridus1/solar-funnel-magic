import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowLeftCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeRole } from "../admin/types/employee";

const ROLE_OPTIONS: { value: EmployeeRole; label: string }[] = [
  { value: "sales_director", label: "Vertriebsleiter" },
  { value: "sales_team_leader", label: "Team Leader" },
  { value: "sales_employee", label: "Vertriebler" },
  { value: "customer_service", label: "Kundenservice" },
  { value: "planning", label: "Planung" },
  { value: "construction_manager", label: "Bauleiter" },
  { value: "installation_manager", label: "Montageleiter" },
  { value: "installer", label: "Monteur" },
];

export const RoleSimulator = () => {
  const [simulatedRole, setSimulatedRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadSimulatedRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('simulated_role')
        .eq('id', user.id)
        .single();

      if (profile?.simulated_role) {
        setSimulatedRole(profile.simulated_role);
      }
    };

    loadSimulatedRole();
  }, []);

  const handleRoleChange = async (role: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ simulated_role: role })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Fehler beim Ändern der Rolle",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSimulatedRole(role);
    toast({
      title: "Rolle geändert",
      description: `Sie simulieren jetzt die Rolle: ${ROLE_OPTIONS.find(r => r.value === role)?.label}`,
    });
    window.location.reload();
  };

  const exitSimulation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ simulated_role: null })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Fehler beim Beenden der Simulation",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSimulatedRole(null);
    toast({
      title: "Simulation beendet",
      description: "Sie sehen nun wieder Ihre normale Ansicht",
    });
    window.location.reload();
  };

  if (!simulatedRole) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-900">Rolle simulieren</h3>
        </div>
        <Select onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Wählen Sie eine Rolle" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-blue-900">
            Simulierte Rolle: {ROLE_OPTIONS.find(r => r.value === simulatedRole)?.label}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={exitSimulation}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
        >
          <ArrowLeftCircle className="h-4 w-4 mr-2" />
          Simulation beenden
        </Button>
      </div>
    </div>
  );
};