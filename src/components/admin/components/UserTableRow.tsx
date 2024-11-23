import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Profile } from "../types/userManagement";
import { Trash2, FileSearch } from "lucide-react";

interface UserTableRowProps {
  user: Profile;
  onSelect: (user: Profile) => void;
  onDelete: (userId: string) => void;
}

export const UserTableRow = ({ user, onSelect, onDelete }: UserTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(user)}
          >
            <FileSearch className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(user.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};