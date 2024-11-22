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
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface Affiliate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  referral_code: string;
  referral_count: number;
  total_leads: number;
  created_at: string;
}

export const AffiliateManagement = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAffiliates();
  }, []);

  const loadAffiliates = async () => {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Fehler beim Laden der Affiliates",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setAffiliates(data || []);
  };

  const copyToClipboard = (referralCode: string) => {
    const baseUrl = window.location.origin;
    const affiliateLink = `${baseUrl}/?ref=${referralCode}`;
    
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link kopiert!",
      description: "Der Affiliate-Link wurde in die Zwischenablage kopiert.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Affiliate Partner</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Referral Code</TableHead>
            <TableHead>Vermittlungen</TableHead>
            <TableHead>Leads</TableHead>
            <TableHead>Registriert am</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {affiliates.map((affiliate) => (
            <TableRow key={affiliate.id}>
              <TableCell>{`${affiliate.first_name} ${affiliate.last_name}`}</TableCell>
              <TableCell>{affiliate.email}</TableCell>
              <TableCell>{affiliate.referral_code}</TableCell>
              <TableCell>{affiliate.referral_count || 0}</TableCell>
              <TableCell>{affiliate.total_leads || 0}</TableCell>
              <TableCell>
                {new Date(affiliate.created_at).toLocaleDateString('de-DE')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(affiliate.referral_code)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Link kopieren
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};