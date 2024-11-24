import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Profile } from "../types/userManagement";
import { Trash2, FileSearch, LogIn } from "lucide-react";

interface UserTableRowProps {
  user: Profile;
  onSelect: (user: Profile) => void;
  onDelete: (userId: string) => void;
}

export const UserTableRow = ({ user, onSelect, onDelete }: UserTableRowProps) => {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(user)}
            className="text-gray-600 hover:text-gray-900"
          >
            <FileSearch className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(user.id)}
            className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 border-red-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};