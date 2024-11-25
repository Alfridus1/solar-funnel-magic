import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Profile } from "../../types/userManagement";
import { Employee } from "../../types/employee";
import { UserTableRow } from "../UserTableRow";

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
  const getUserTypeLabel = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'sales_employee':
      case 'external_sales':
      case 'customer_service':
      case 'planning':
      case 'accountant':
      case 'construction_manager':
      case 'installation_manager':
      case 'installer':
      case 'executive':
      case 'sales_team_leader':
      case 'sales_director':
        return 'Mitarbeiter';
      case 'customer':
        return 'Kunde';
      default:
        return 'Unbekannt';
    }
  };

  const filteredUsers = users.filter(user => {
    if (userTypeFilter === "all") return true;
    const userType = getUserTypeLabel(user.role);
    return userTypeFilter === userType;
  });

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Telefon</TableHead>
            <TableHead className="font-semibold">Typ</TableHead>
            <TableHead className="font-semibold text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <UserTableRow 
              key={user.id}
              user={user}
              employee={employees.find(e => e.profile_id === user.id)}
              userType={getUserTypeLabel(user.role)}
              onSelect={onUserSelect}
              onDelete={onDeleteUser}
              onEdit={onEditEmployee}
              onResetPassword={onResetPassword}
              onLoginAs={onLoginAs}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};