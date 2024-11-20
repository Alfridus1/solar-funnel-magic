import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  created_at: string;
}

export const LeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Fehler beim Laden der Anfragen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setLeads(data);
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: "Fehler beim Aktualisieren des Status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    loadLeads();
    toast({
      title: "Status aktualisiert",
      description: "Der Status wurde erfolgreich aktualisiert.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Anfragen</h2>
        <Button onClick={loadLeads}>Aktualisieren</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                {format(new Date(lead.created_at), 'dd.MM.yyyy HH:mm')}
              </TableCell>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>
                <Badge variant={lead.type === 'quote' ? 'default' : 'secondary'}>
                  {lead.type === 'quote' ? 'Angebot' : 'Beratung'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={lead.status === 'new' ? 'default' : 'outline'}
                >
                  {lead.status === 'new' ? 'Neu' : 'Bearbeitet'}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLeadStatus(lead.id, lead.status === 'new' ? 'processed' : 'new')}
                >
                  Status ändern
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};