import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Folder, Users, Wallet } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CustomerLayout } from "./layout/CustomerLayout";
import { useLocation, useNavigate } from "react-router-dom";

interface DashboardData {
  leads: any[];
  affiliateData: {
    referralCount: number;
    totalLeads: number;
    earnings: number;
  } | null;
}

export function CustomerDashboard() {
  const [data, setData] = useState<DashboardData>({
    leads: [],
    affiliateData: null
  });
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.hash.replace("#", "") || "solar";

  useEffect(() => {
    if (!location.hash) {
      navigate("#solar", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Load user's leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      // Check if user is an affiliate
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', userData.user.id)
        .single();

      let affiliateStats = null;

      if (affiliateData && !affiliateError) {
        // Load affiliate statistics
        const { data: referredLeads, error: referredError } = await supabase
          .from('leads')
          .select('*')
          .eq('affiliate_id', affiliateData.id);

        const { data: bonuses, error: bonusesError } = await supabase
          .from('affiliate_bonuses')
          .select('amount')
          .eq('affiliate_id', affiliateData.id)
          .eq('status', 'paid');

        if (!referredError && !bonusesError) {
          affiliateStats = {
            referralCount: referredLeads?.length || 0,
            totalLeads: referredLeads?.length || 0,
            earnings: bonuses?.reduce((sum, bonus) => sum + (bonus.amount || 0), 0) || 0
          };
        }
      }

      setData({
        leads: leadsData || [],
        affiliateData: affiliateStats
      });

    } catch (error: any) {
      toast({
        title: "Fehler beim Laden der Daten",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "solar":
        return <SolarSystemOverview data={data} />;
      case "documents":
        return <DocumentsOverview data={data} />;
      case "affiliates":
        return <AffiliatesOverview data={data} />;
      case "wallet":
        return <WalletOverview data={data} />;
      case "settings":
        return <SettingsOverview />;
      default:
        return <SolarSystemOverview data={data} />;
    }
  };

  return (
    <CustomerLayout>
      {renderContent()}
    </CustomerLayout>
  );
}

// Komponenten für die verschiedenen Tabs
const SolarSystemOverview = ({ data }: { data: DashboardData }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Meine Solaranlage</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Anfragen</CardTitle>
            <FileText className="h-4 w-4 text-solar-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.leads.length}</div>
            <p className="text-xs text-muted-foreground">
              Letzte Anfrage: {data.leads[0] ? 
                format(new Date(data.leads[0].created_at), 'dd. MMMM yyyy', {locale: de}) : 
                'Keine Anfragen'}
            </p>
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Dokumente</CardTitle>
            <Folder className="h-4 w-4 text-solar-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Alle wichtigen Unterlagen
            </p>
          </CardContent>
        </Card>

        {/* Affiliate Stats Card */}
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Empfehlungen</CardTitle>
            <Users className="h-4 w-4 text-solar-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.affiliateData ? data.affiliateData.referralCount : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.affiliateData ? 
                `${data.affiliateData.totalLeads} Anfragen generiert` : 
                'Werden Sie Affiliate Partner'}
            </p>
          </CardContent>
        </Card>

        {/* Wallet Card */}
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Wallet</CardTitle>
            <Wallet className="h-4 w-4 text-solar-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.affiliateData ? 
                `${data.affiliateData.earnings.toLocaleString('de-DE')} €` : 
                '0 €'}
            </div>
            <p className="text-xs text-muted-foreground">
              Verfügbares Guthaben
            </p>
          </CardContent>
        </Card>
    </div>
  </div>
);

const DocumentsOverview = ({ data }: { data: DashboardData }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Dokumente</h1>
    <Card>
      <CardHeader>
        <CardTitle>Ihre Dokumente</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Noch keine Dokumente vorhanden</p>
      </CardContent>
    </Card>
  </div>
);

const AffiliatesOverview = ({ data }: { data: DashboardData }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Meine Affiliates</h1>
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Übersicht</CardTitle>
      </CardHeader>
      <CardContent>
        {data.affiliateData ? (
          <div className="space-y-4">
            <p>Empfehlungen: {data.affiliateData.referralCount}</p>
            <p>Generierte Anfragen: {data.affiliateData.totalLeads}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Werden Sie jetzt Affiliate Partner</p>
        )}
      </CardContent>
    </Card>
  </div>
);

const WalletOverview = ({ data }: { data: DashboardData }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Wallet</h1>
    <Card>
      <CardHeader>
        <CardTitle>Ihr Guthaben</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {data.affiliateData ? 
            `${data.affiliateData.earnings.toLocaleString('de-DE')} €` : 
            '0 €'}
        </div>
        <p className="text-muted-foreground">Verfügbares Guthaben</p>
      </CardContent>
    </Card>
  </div>
);

const SettingsOverview = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Einstellungen</h1>
    <Card>
      <CardHeader>
        <CardTitle>Ihre Einstellungen</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Einstellungen werden hier angezeigt</p>
      </CardContent>
    </Card>
  </div>
);
