import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Employee } from "../../types/employee";
import { EmployeeTableRow } from "./EmployeeTableRow";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onResetPassword: (email: string) => void;
  onLoginAs: (email: string) => void;
  isResetting: boolean;
}

export const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  onResetPassword,
  onLoginAs,
  isResetting,
}: EmployeeTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rolle</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <EmployeeTableRow
            key={employee.id}
            employee={employee}
            onEdit={onEdit}
            onDelete={onDelete}
            onResetPassword={onResetPassword}
            onLoginAs={onLoginAs}
            isResetting={isResetting}
          />
        ))}
      </TableBody>
    </Table>
  );
};