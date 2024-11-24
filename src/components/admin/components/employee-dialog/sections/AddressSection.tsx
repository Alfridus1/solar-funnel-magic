import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface AddressSectionProps {
  address: string;
  onChange: (address: string) => void;
}

export const AddressSection = ({ address, onChange }: AddressSectionProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Adresse</h3>
      <div className="space-y-2">
        <Label>Vollständige Adresse</Label>
        <Input
          value={address}
          onChange={(e) => onChange(e.target.value)}
          className="h-12"
          placeholder="Straße, Hausnummer, PLZ, Stadt"
        />
      </div>
    </Card>
  );
};