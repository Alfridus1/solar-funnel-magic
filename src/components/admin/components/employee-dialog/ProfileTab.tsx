import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AddressSection } from "./sections/AddressSection";
import { BankSection } from "./sections/BankSection";
import { CompensationSection } from "./sections/CompensationSection";

interface ProfileTabProps {
  employeeId: string;
}

export const ProfileTab = ({ employeeId }: ProfileTabProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    address: "",
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
        address: data.address || "",
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
        address: profile.address,
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

  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <AddressSection
        address={profile.address}
        onChange={(value) => handleFieldChange('address', value)}
      />

      <BankSection
        iban={profile.iban}
        onChange={(value) => handleFieldChange('iban', value)}
      />

      <CompensationSection
        baseSalary={parseFloat(profile.base_salary) || 0}
        commissionEnabled={profile.commission_enabled}
        vacationDays={parseInt(profile.vacation_days) || 30}
        hoursPerMonth={parseInt(profile.hours_per_month) || 160}
        hasCompanyCar={profile.has_company_car}
        onChange={handleFieldChange}
      />

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Änderungen speichern
        </Button>
      </div>
    </div>
  );
};