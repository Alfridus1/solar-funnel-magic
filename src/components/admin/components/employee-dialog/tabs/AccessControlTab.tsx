import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

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
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPermissions(data.permissions);
      } else {
        // Set default permissions if none exist
        const defaultPermissions = ACCESS_PERMISSIONS.reduce((acc, { feature }) => ({
          ...acc,
          [feature]: false
        }), {});
        setPermissions(defaultPermissions);
      }
    } catch (error: any) {
      console.error('Error loading permissions:', error);
      toast({
        title: "Fehler beim Laden",
        description: "Die Berechtigungen konnten nicht geladen werden.",
        variant: "destructive",
      });
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
    } catch (error: any) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white/50 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Zugriffsberechtigungen</h3>
          <Button 
            onClick={savePermissions} 
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? "Wird gespeichert..." : "Änderungen speichern"}
          </Button>
        </div>

        <div className="grid gap-4">
          {ACCESS_PERMISSIONS.map((permission) => (
            <motion.div
              key={permission.feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900">{permission.label}</h4>
                    <p className="text-sm text-gray-500">{permission.description}</p>
                  </div>
                  <Switch
                    checked={permissions[permission.feature] || false}
                    onCheckedChange={(checked) => handlePermissionChange(permission.feature, checked)}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};