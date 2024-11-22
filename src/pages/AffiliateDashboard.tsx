import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

type Lead = Tables<"leads">;
type Affiliate = Tables<"affiliates">;

export default function AffiliateDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch affiliate data
        const { data: affiliateData, error: affiliateError } = await supabase
          .from("affiliates")
          .select("*")
          .single();

        if (affiliateError) throw affiliateError;
        setAffiliate(affiliateData);

        // Fetch leads data
        const { data: leadsData, error: leadsError } = await supabase
          .from("leads")
          .select("*")
          .eq("affiliate_id", affiliateData.id);

        if (leadsError) throw leadsError;
        setLeads(leadsData);
      } catch (error) {
        toast({
          title: "Fehler beim Laden der Daten",
          description: "Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      }
    }

    fetchData();
  }, [toast]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>

      {affiliate && (
        <Card>
          <CardHeader>
            <CardTitle>Ihre Affiliate-Informationen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {affiliate.first_name} {affiliate.last_name}</p>
              <p><strong>Email:</strong> {affiliate.email}</p>
              <p><strong>Ihr Referral-Link:</strong> {window.location.origin}/?ref={affiliate.referral_code}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ihre generierten Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{new Date(lead.created_at || "").toLocaleDateString("de-DE")}</TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Noch keine Leads generiert
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}