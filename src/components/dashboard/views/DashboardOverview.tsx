import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { SystemOverview } from "./components/SystemOverview";
import { NewsSection } from "./components/NewsSection";
import { CircleUserRound } from "lucide-react";
import { EnergyProductionChart } from "./components/EnergyProductionChart";

export const DashboardOverview = () => {
  const [greeting, setGreeting] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Guten Morgen";
      if (hour < 18) return "Guten Tag";
      return "Guten Abend";
    };

    const loadUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        if (profile) {
          const title = profile.first_name.toLowerCase().endsWith('a') ? 'Frau' : 'Herr';
          setTitle(title);
          setUserFullName(`${profile.last_name}`);
        }
      }
    };

    setGreeting(getTimeBasedGreeting());
    loadUserProfile();

    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50">
        <CardHeader>
          <CardTitle className="text-2xl">
            {greeting} {title} {userFullName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Willkommen in Ihrem persönlichen Solar-Dashboard
          </p>
        </CardContent>
      </Card>

      <SystemOverview />

      <Card>
        <CardHeader>
          <CardTitle>Ihr persönliches COPPEN Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <CircleUserRound className="h-8 w-8 text-solar-orange" />
              <div>
                <p className="font-medium">Ihr Vertriebler</p>
                <p className="text-sm text-muted-foreground">Max Mustermann</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CircleUserRound className="h-8 w-8 text-solar-orange" />
              <div>
                <p className="font-medium">Ihr Bauleiter</p>
                <p className="text-sm text-muted-foreground">Thomas Schmidt</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CircleUserRound className="h-8 w-8 text-solar-orange" />
              <div>
                <p className="font-medium">Ihr Kundendienst</p>
                <p className="text-sm text-muted-foreground">Anna Weber</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Energieproduktion</CardTitle>
            </CardHeader>
            <CardContent>
              <EnergyProductionChart />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <NewsSection />
        </div>
      </div>
    </div>
  );
};