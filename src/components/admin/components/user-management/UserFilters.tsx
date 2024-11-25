import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFiltersProps {
  userTypeFilter: string;
  onFilterChange: (value: string) => void;
}

export const UserFilters = ({ userTypeFilter, onFilterChange }: UserFiltersProps) => {
  return (
    <Select
      value={userTypeFilter}
      onValueChange={onFilterChange}
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
  );
};