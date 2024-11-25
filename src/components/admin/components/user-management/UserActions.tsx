import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface UserActionsProps {
  onAddEmployee: () => void;
  onResetAllPasswords: () => void;
  isResettingPasswords: boolean;
}

export const UserActions = ({ onAddEmployee, onResetAllPasswords, isResettingPasswords }: UserActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button onClick={onAddEmployee} className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Mitarbeiter hinzufügen
      </Button>
      <Button 
        onClick={onResetAllPasswords}
        disabled={isResettingPasswords}
        variant="outline"
        className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
      >
        {isResettingPasswords ? "Wird zurückgesetzt..." : "Alle Passwörter zurücksetzen"}
      </Button>
    </div>
  );
};