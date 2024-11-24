import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AccessPermission {
  feature: string;
  label: string;
  description: string;
}

const ACCESS_PERMISSIONS: AccessPermission[] = [
  {
    feature: "leads_management",
    label: "Leads Verwaltung",
    description: "Zugriff auf alle Lead-bezogenen Funktionen"
  },
  {
    feature: "customer_management",
    label: "Kundenverwaltung",
    description: "Verwaltung von Kundendaten und -beziehungen"
  },
  {
    feature: "project_management",
    label: "Projektverwaltung",
    description: "Zugriff auf Projektplanung und -durchführung"
  },
  {
    feature: "inventory_management",
    label: "Lagerverwaltung",
    description: "Verwaltung von Produkten und Lagerbeständen"
  },
  {
    feature: "financial_access",
    label: "Finanzzugriff",
    description: "Zugriff auf finanzielle Daten und Berichte"
  },
  {
    feature: "employee_management",
    label: "Mitarbeiterverwaltung",
    description: "Verwaltung von Mitarbeiterdaten und Berechtigungen"
  },
  {
    feature: "reporting",
    label: "Berichtswesen",
    description: "Zugriff auf Analysen und Berichte"
  }
];

interface AccessControlTabProps {
  employeeId: string;
}

export const AccessControlTab = ({ employeeId }: AccessControlTabProps) => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, [employeeId]);

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_permissions')
        .select('permissions')
        .eq('employee_id', employeeId)
        .single();

      if (error) throw error;
      setPermissions(data?.permissions || {});
    } catch (error) {
      console.error('Error loading permissions:', error);
      setPermissions({});
    }
  };

  const handlePermissionChange = (feature: string, enabled: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [feature]: enabled
    }));
  };

  const savePermissions = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('employee_permissions')
        .upsert({
          employee_id: employeeId,
          permissions: permissions,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Berechtigungen gespeichert",
        description: "Die Zugriffsberechtigungen wurden erfolgreich aktualisiert.",
      });
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Fehler beim Speichern",
        description: "Die Berechtigungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Zugriffsberechtigungen</h3>
        <Button 
          onClick={savePermissions} 
          disabled={isSaving}
        >
          {isSaving ? "Wird gespeichert..." : "Änderungen speichern"}
        </Button>
      </div>

      <div className="grid gap-4">
        {ACCESS_PERMISSIONS.map((permission) => (
          <Card key={permission.feature} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{permission.label}</h4>
                <p className="text-sm text-gray-500">{permission.description}</p>
              </div>
              <Switch
                checked={permissions[permission.feature] || false}
                onCheckedChange={(checked) => handlePermissionChange(permission.feature, checked)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};