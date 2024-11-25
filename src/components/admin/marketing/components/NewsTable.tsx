import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface NewsTableProps {
  news: any[];
  onEdit: (news: any) => void;
  onDelete: (id: string) => void;
}

export const NewsTable = ({ news, onEdit, onDelete }: NewsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titel</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead>Veröffentlicht am</TableHead>
          <TableHead className="text-right">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {news.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.title}</TableCell>
            <TableCell>
              <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                {item.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
              </Badge>
            </TableCell>
            <TableCell>
              {item.profiles?.first_name} {item.profiles?.last_name}
            </TableCell>
            <TableCell>
              {item.published_at ? format(new Date(item.published_at), 'dd.MM.yyyy HH:mm') : '-'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};