import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPermission } from "@/types/permissions";
import { supabase } from "@/integrations/supabase/client";

interface CustomRole {
  id: string;
  name: string;
  description: string | null;
  permissions: UserPermission[];
}

const AVAILABLE_PERMISSIONS: { value: UserPermission; label: string }[] = [
  { value: "customer_access", label: "Kunden Zugriff" },
  { value: "employee_access", label: "Mitarbeiter Zugriff" },
  { value: "admin_access", label: "Admin Zugriff" },
  { value: "leads_management", label: "Leads Verwaltung" },
  { value: "customer_management", label: "Kunden Verwaltung" },
  { value: "project_management", label: "Projekt Verwaltung" },
  { value: "inventory_management", label: "Inventar Verwaltung" },
  { value: "financial_access", label: "Finanz Zugriff" },
  { value: "employee_management", label: "Mitarbeiter Verwaltung" },
  { value: "reporting", label: "Berichtswesen" },
];

export const RoleManagement = () => {
  const queryClient = useQueryClient();
  const [newRole, setNewRole] = useState({ name: "", description: "", permissions: [] as UserPermission[] });

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as CustomRole[];
    },
  });

  const createRole = useMutation({
    mutationFn: async (role: Omit<CustomRole, "id">) => {
      const { data, error } = await supabase
        .from("custom_roles")
        .insert([role])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setNewRole({ name: "", description: "", permissions: [] });
      toast({
        title: "Rolle erstellt",
        description: "Die neue Rolle wurde erfolgreich angelegt.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Die Rolle konnte nicht erstellt werden: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("custom_roles")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({
        title: "Rolle gelöscht",
        description: "Die Rolle wurde erfolgreich gelöscht.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Die Rolle konnte nicht gelöscht werden: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Namen für die Rolle ein.",
        variant: "destructive",
      });
      return;
    }
    createRole.mutate(newRole);
  };

  if (isLoading) {
    return <div>Lädt...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Neue Rolle erstellen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="Rollenname"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Beschreibung</label>
            <Textarea
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              placeholder="Beschreibung der Rolle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Berechtigungen</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <div key={permission.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.value}
                    checked={newRole.permissions.includes(permission.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewRole({
                          ...newRole,
                          permissions: [...newRole.permissions, permission.value],
                        });
                      } else {
                        setNewRole({
                          ...newRole,
                          permissions: newRole.permissions.filter((p) => p !== permission.value),
                        });
                      }
                    }}
                  />
                  <label htmlFor={permission.value} className="text-sm">
                    {permission.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={createRole.isPending}>
            {createRole.isPending ? "Wird erstellt..." : "Rolle erstellen"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Vorhandene Rollen</h2>
        <div className="space-y-4">
          {roles?.map((role) => (
            <div key={role.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{role.name}</h3>
                  <p className="text-gray-600 text-sm">{role.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary">
                        {AVAILABLE_PERMISSIONS.find((p) => p.value === permission)?.label || permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteRole.mutate(role.id)}
                  disabled={deleteRole.isPending}
                >
                  Löschen
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};