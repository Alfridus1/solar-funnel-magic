import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface ContractTabProps {
  employeeId: string;
}

export const ContractTab = ({ employeeId }: ContractTabProps) => {
  const [contractData, setContractData] = useState({
    base_salary: "",
    commission_enabled: false,
    vacation_days: "30",
    hours_per_month: "160",
    has_company_car: false
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContractData();
  }, [employeeId]);

  const loadContractData = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('base_salary, commission_enabled, vacation_days, hours_per_month, has_company_car')
        .eq('id', employeeId)
        .single();

      if (error) throw error;
      if (data) {
        setContractData({
          base_salary: data.base_salary?.toString() || "",
          commission_enabled: data.commission_enabled || false,
          vacation_days: data.vacation_days?.toString() || "30",
          hours_per_month: data.hours_per_month?.toString() || "160",
          has_company_car: data.has_company_car || false
        });
      }
    } catch (error) {
      console.error('Error loading contract data:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          base_salary: parseFloat(contractData.base_salary),
          commission_enabled: contractData.commission_enabled,
          vacation_days: parseInt(contractData.vacation_days),
          hours_per_month: parseInt(contractData.hours_per_month),
          has_company_car: contractData.has_company_car,
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId);

      if (error) throw error;

      toast({
        title: "Vertragsdaten gespeichert",
        description: "Die Vertragsdaten wurden erfolgreich aktualisiert.",
      });
    } catch (error) {
      console.error('Error saving contract data:', error);
      toast({
        title: "Fehler beim Speichern",
        description: "Die Vertragsdaten konnten nicht gespeichert werden.",
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
      <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="base_salary" className="text-gray-700">Fixgehalt (€)</Label>
            <Input
              id="base_salary"
              type="number"
              value={contractData.base_salary}
              onChange={(e) => setContractData(prev => ({ ...prev, base_salary: e.target.value }))}
              className="h-12 bg-white"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div>
              <Label htmlFor="commission_enabled" className="text-gray-700">Provision</Label>
              <p className="text-sm text-gray-500">Provision für Verkäufe aktivieren</p>
            </div>
            <Switch
              id="commission_enabled"
              checked={contractData.commission_enabled}
              onCheckedChange={(checked) => setContractData(prev => ({ ...prev, commission_enabled: checked }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vacation_days" className="text-gray-700">Urlaubstage pro Jahr</Label>
            <Input
              id="vacation_days"
              type="number"
              value={contractData.vacation_days}
              onChange={(e) => setContractData(prev => ({ ...prev, vacation_days: e.target.value }))}
              className="h-12 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours_per_month" className="text-gray-700">Arbeitsstunden pro Monat</Label>
            <Input
              id="hours_per_month"
              type="number"
              value={contractData.hours_per_month}
              onChange={(e) => setContractData(prev => ({ ...prev, hours_per_month: e.target.value }))}
              className="h-12 bg-white"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div>
              <Label htmlFor="has_company_car" className="text-gray-700">Firmenwagen</Label>
              <p className="text-sm text-gray-500">Firmenwagen zur Verfügung stellen</p>
            </div>
            <Switch
              id="has_company_car"
              checked={contractData.has_company_car}
              onCheckedChange={(checked) => setContractData(prev => ({ ...prev, has_company_car: checked }))}
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 mt-6"
        >
          {isSaving ? "Wird gespeichert..." : "Änderungen speichern"}
        </Button>
      </Card>
    </motion.div>
  );
};