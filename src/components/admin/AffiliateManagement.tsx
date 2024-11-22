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

interface Affiliate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  referral_code: string;
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
            <TableHead>Registriert am</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {affiliates.map((affiliate) => (
            <TableRow key={affiliate.id}>
              <TableCell>{`${affiliate.first_name} ${affiliate.last_name}`}</TableCell>
              <TableCell>{affiliate.email}</TableCell>
              <TableCell>{affiliate.referral_code}</TableCell>
              <TableCell>
                {new Date(affiliate.created_at).toLocaleDateString('de-DE')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};