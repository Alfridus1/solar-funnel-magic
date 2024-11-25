import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { FileEdit, KeyRound, Trash2 } from "lucide-react";
import { Employee } from "../../types/employee";
import { roleTranslations } from "@/utils/roleTranslations";

interface EmployeeTableRowProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onResetPassword: (email: string) => void;
  isResetting: boolean;
}

export const EmployeeTableRow = ({
  employee,
  onEdit,
  onDelete,
  onResetPassword,
  isResetting,
}: EmployeeTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        {employee.profiles?.first_name} {employee.profiles?.last_name}
      </TableCell>
      <TableCell>{employee.profiles?.email}</TableCell>
      <TableCell>{roleTranslations[employee.role] || employee.role}</TableCell>
      <TableCell>{employee.team_id || '-'}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(employee)}
          >
            <FileEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onResetPassword(employee.profiles?.email || '')}
            disabled={isResetting || !employee.profiles?.email}
          >
            <KeyRound className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(employee.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};