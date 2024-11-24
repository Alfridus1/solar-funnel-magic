import { UseFormReturn } from "react-hook-form";
import { EmployeeFormFields } from "../../EmployeeFormFields";
import { EmployeeFormData } from "../../../types/employeeForm";
import { Button } from "@/components/ui/button";

interface BasicInfoTabProps {
  form: UseFormReturn<EmployeeFormData>;
  onCancel: () => void;
  isEditing: boolean;
}

export const BasicInfoTab = ({ form, onCancel, isEditing }: BasicInfoTabProps) => {
  return (
    <div className="space-y-4">
      <EmployeeFormFields form={form} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit">
          {isEditing ? "Speichern" : "Erstellen"}
        </Button>
      </div>
    </div>
  );
};