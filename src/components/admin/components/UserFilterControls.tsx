import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UserFilterControlsProps {
  userTypeFilter: string;
  setUserTypeFilter: (value: string) => void;
  onResetPasswords: () => void;
  isResettingPasswords: boolean;
}

export const UserFilterControls = ({
  userTypeFilter,
  setUserTypeFilter,
  onResetPasswords,
  isResettingPasswords,
}: UserFilterControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Benutzerverwaltung</h2>
        <Select
          value={userTypeFilter}
          onValueChange={setUserTypeFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Benutzertyp filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Benutzer</SelectItem>
            <SelectItem value="Kunde">Kunden</SelectItem>
            <SelectItem value="Mitarbeiter">Mitarbeiter</SelectItem>
            <SelectItem value="Administrator">Administratoren</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button 
        onClick={onResetPasswords}
        disabled={isResettingPasswords}
        variant="outline"
        className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
      >
        {isResettingPasswords ? "Wird zurückgesetzt..." : "Alle Passwörter zurücksetzen"}
      </Button>
    </div>
  );
};