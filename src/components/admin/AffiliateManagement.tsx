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
import { Card } from "@/components/ui/card";
import { Copy, Users, TrendingUp, Calendar } from "lucide-react";

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
    try {
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
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden der Affiliates",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (referralCode: string) => {
    const affiliateLink = `https://coppen.app/?ref=${referralCode}`;
    
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link kopiert!",
      description: "Der Affiliate-Link wurde in die Zwischenablage kopiert.",
    });
  };

  const totalReferrals = affiliates.reduce((sum, affiliate) => sum + (affiliate.referral_count || 0), 0);
  const totalLeads = affiliates.reduce((sum, affiliate) => sum + (affiliate.total_leads || 0), 0);
  const activeAffiliates = affiliates.filter(a => a.referral_count > 0).length;

  return (
    <div className="space-y-6 p-6 bg-gray-50/50">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Affiliate Partner</h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktive Partner</p>
              <p className="text-2xl font-bold text-gray-900">{activeAffiliates}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vermittlungen</p>
              <p className="text-2xl font-bold text-gray-900">{totalReferrals}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Generierte Leads</p>
              <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Affiliate Table */}
      <Card className="bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead className="text-right">Vermittlungen</TableHead>
              <TableHead className="text-right">Leads</TableHead>
              <TableHead>Registriert am</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {affiliates.map((affiliate) => (
              <TableRow 
                key={affiliate.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="font-medium">
                  {`${affiliate.first_name} ${affiliate.last_name}`}
                </TableCell>
                <TableCell>{affiliate.email}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {affiliate.referral_code}
                  </code>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {affiliate.referral_count || 0}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {affiliate.total_leads || 0}
                </TableCell>
                <TableCell>
                  {new Date(affiliate.created_at).toLocaleDateString('de-DE')}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(affiliate.referral_code)}
                    className="hover:bg-gray-100"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Link kopieren
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};