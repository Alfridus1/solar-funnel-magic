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
import { PDFDownloadButton } from "../solar-showcase/components/PDFDownloadButton";
import { Trash2 } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  created_at: string;
  metrics?: any;
  address?: string;
  user_id?: string;
  profile?: {
    id: string;
    first_name: string;
    last_name: string;
  };
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
      .select(`
        *,
        profile:profiles(id, first_name, last_name)
      `)
      .is('deleted_at', null)
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

  const handleDeleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setLeads(leads.filter(lead => lead.id !== id));
      toast({
        title: "Anfrage gelöscht",
        description: "Die Anfrage wurde erfolgreich gelöscht.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
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
            <TableHead>Benutzerprofil</TableHead>
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
                {lead.profile ? (
                  <Badge variant="outline" className="bg-green-50">
                    {`${lead.profile.first_name} ${lead.profile.last_name}`}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50">
                    Kein Profil
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateLeadStatus(lead.id, lead.status === 'new' ? 'processed' : 'new')}
                  >
                    Status ändern
                  </Button>
                  {lead.metrics && lead.address && (
                    <PDFDownloadButton 
                      metrics={lead.metrics} 
                      address={lead.address}
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteLead(lead.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};