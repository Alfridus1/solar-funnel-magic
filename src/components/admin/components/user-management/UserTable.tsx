import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserTableRow } from "../UserTableRow";
import { Profile } from "../../types/userManagement";
import { Employee } from "../../types/employee";

interface UserTableProps {
  users: Profile[];
  employees: Employee[];
  onUserSelect: (user: Profile) => void;
  onDeleteUser: (userId: string) => void;
  onEditEmployee: (employee: Employee) => void;
  onResetPassword: (email: string) => void;
  onLoginAs: (email: string) => void;
  userTypeFilter: string;
}

export const UserTable = ({
  users,
  employees,
  onUserSelect,
  onDeleteUser,
  onEditEmployee,
  onResetPassword,
  onLoginAs,
  userTypeFilter,
}: UserTableProps) => {
  const filteredUsers = users.filter(user => {
    if (userTypeFilter === "all") return true;
    if (userTypeFilter === "employees") return employees.some(emp => emp.profile_id === user.id);
    return !employees.some(emp => emp.profile_id === user.id);
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers.map((user) => {
          const employee = employees.find(emp => emp.profile_id === user.id);
          const userType = employee ? "Employee" : "Customer";
          
          return (
            <UserTableRow
              key={user.id}
              user={user}
              employee={employee}
              userType={userType}
              onSelect={onUserSelect}
              onDelete={onDeleteUser}
              onEdit={onEditEmployee}
              onResetPassword={onResetPassword}
              onLoginAs={onLoginAs}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};