import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface BankSectionProps {
  iban: string;
  onChange: (iban: string) => void;
}

export const BankSection = ({ iban, onChange }: BankSectionProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Bankdaten</h3>
      <div className="space-y-2">
        <Label>IBAN</Label>
        <Input
          value={iban}
          onChange={(e) => onChange(e.target.value)}
          className="h-12"
          placeholder="DE89 3704 0044 0532 0130 00"
        />
      </div>
    </Card>
  );
};