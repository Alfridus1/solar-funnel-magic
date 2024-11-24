import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

interface CompensationSectionProps {
  baseSalary: number;
  commissionEnabled: boolean;
  vacationDays: number;
  hoursPerMonth: number;
  hasCompanyCar: boolean;
  onChange: (field: string, value: number | boolean) => void;
}

export const CompensationSection = ({
  baseSalary,
  commissionEnabled,
  vacationDays,
  hoursPerMonth,
  hasCompanyCar,
  onChange,
}: CompensationSectionProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Vergütung & Arbeitszeit</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fixgehalt (€)</Label>
            <Input
              type="number"
              value={baseSalary}
              onChange={(e) => onChange('base_salary', Number(e.target.value))}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>Arbeitsstunden pro Monat</Label>
            <Input
              type="number"
              value={hoursPerMonth}
              onChange={(e) => onChange('hours_per_month', Number(e.target.value))}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>Urlaubstage pro Jahr</Label>
            <Input
              type="number"
              value={vacationDays}
              onChange={(e) => onChange('vacation_days', Number(e.target.value))}
              className="h-12"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Label>Provision aktiviert</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={commissionEnabled}
                onCheckedChange={(checked) => onChange('commission_enabled', checked)}
              />
              <span>{commissionEnabled ? "Ja" : "Nein"}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Firmenwagen</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={hasCompanyCar}
                onCheckedChange={(checked) => onChange('has_company_car', checked)}
              />
              <span>{hasCompanyCar ? "Ja" : "Nein"}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};