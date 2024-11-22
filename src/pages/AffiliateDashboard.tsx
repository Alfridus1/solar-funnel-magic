import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function AffiliateDashboard() {
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Fetch affiliate data
      const { data: affiliateData, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !affiliateData) {
        navigate("/login");
        return;
      }

      setAffiliateData(affiliateData);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!affiliateData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Abmelden
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Willkommen, {affiliateData.first_name}!</h2>
          <p className="text-gray-600">
            Ihr Affiliate-Dashboard wird derzeit eingerichtet. Hier werden Sie bald Ihre Statistiken und Provisionen sehen können.
          </p>
        </Card>
      </div>
    </div>
  );
}