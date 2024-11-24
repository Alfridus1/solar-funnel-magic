import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileTabProps {
  employeeId: string;
}

export const ProfileTab = ({ employeeId }: ProfileTabProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    street: "",
    house_number: "",
    postal_code: "",
    city: "",
    country: "Deutschland",
    iban: "",
    base_salary: "",
    commission_enabled: false,
    vacation_days: "30",
    hours_per_month: "160",
    has_company_car: false,
  });

  useEffect(() => {
    fetchProfile();
  }, [employeeId]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (error) {
      toast({
        title: "Fehler beim Laden",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setProfile({
        street: data.street || "",
        house_number: data.house_number || "",
        postal_code: data.postal_code || "",
        city: data.city || "",
        country: "Deutschland",
        iban: data.iban || "",
        base_salary: data.base_salary?.toString() || "",
        commission_enabled: data.commission_enabled || false,
        vacation_days: data.vacation_days?.toString() || "30",
        hours_per_month: data.hours_per_month?.toString() || "160",
        has_company_car: data.has_company_car || false,
      });
    }
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('employees')
      .update({
        street: profile.street,
        house_number: profile.house_number,
        postal_code: profile.postal_code,
        city: profile.city,
        iban: profile.iban,
        base_salary: parseFloat(profile.base_salary),
        commission_enabled: profile.commission_enabled,
        vacation_days: parseInt(profile.vacation_days),
        hours_per_month: parseInt(profile.hours_per_month),
        has_company_car: profile.has_company_car,
      })
      .eq('id', employeeId);

    if (error) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Erfolgreich gespeichert",
      description: "Die Profildaten wurden aktualisiert.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Straße</Label>
            <Input
              value={profile.street}
              onChange={(e) => setProfile({ ...profile, street: e.target.value })}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>Hausnummer</Label>
            <Input
              value={profile.house_number}
              onChange={(e) => setProfile({ ...profile, house_number: e.target.value })}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>PLZ</Label>
            <Input
              value={profile.postal_code}
              onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>Stadt</Label>
            <Input
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>Land</Label>
            <Input value={profile.country} disabled className="h-12 bg-gray-100" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Bankdaten</h3>
        <div className="space-y-2">
          <Label>IBAN</Label>
          <Input
            value={profile.iban}
            onChange={(e) => setProfile({ ...profile, iban: e.target.value })}
            className="h-12"
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Vergütung & Arbeitszeit</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fixgehalt (€)</Label>
              <Input
                type="number"
                value={profile.base_salary}
                onChange={(e) => setProfile({ ...profile, base_salary: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>Arbeitsstunden pro Monat</Label>
              <Input
                type="number"
                value={profile.hours_per_month}
                onChange={(e) => setProfile({ ...profile, hours_per_month: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>Urlaubstage pro Jahr</Label>
              <Input
                type="number"
                value={profile.vacation_days}
                onChange={(e) => setProfile({ ...profile, vacation_days: e.target.value })}
                className="h-12"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label>Provision aktiviert</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={profile.commission_enabled}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, commission_enabled: checked })
                  }
                />
                <span>{profile.commission_enabled ? "Ja" : "Nein"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Firmenwagen</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={profile.has_company_car}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, has_company_car: checked })
                  }
                />
                <span>{profile.has_company_car ? "Ja" : "Nein"}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Änderungen speichern
        </Button>
      </div>
    </div>
  );
};