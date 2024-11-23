import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadLead = async () => {
      try {
        if (!id) {
          throw new Error("No lead ID provided");
        }

        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setLead(data);
      } catch (error: any) {
        toast({
          title: "Fehler beim Laden der Anfrage",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadLead();
  }, [id, toast]);

  if (loading) {
    return <div>Lädt...</div>;
  }

  if (!lead) {
    return <div>Anfrage nicht gefunden</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Ihre Solar-Anfrage</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Kontaktdaten</h2>
            <p>Name: {lead.name}</p>
            <p>E-Mail: {lead.email}</p>
            <p>Telefon: {lead.phone}</p>
          </div>

          {lead.address && (
            <div>
              <h2 className="font-semibold">Installationsadresse</h2>
              <p>{lead.address}</p>
            </div>
          )}

          {lead.metrics && (
            <div>
              <h2 className="font-semibold">System-Details</h2>
              <p>Dachfläche: {lead.metrics.roofArea} m²</p>
              <p>Geschätzte Leistung: {lead.metrics.kWp} kWp</p>
            </div>
          )}

          <div>
            <h2 className="font-semibold">Status</h2>
            <p>{lead.status === 'new' ? 'Neu eingegangen' : 'In Bearbeitung'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};