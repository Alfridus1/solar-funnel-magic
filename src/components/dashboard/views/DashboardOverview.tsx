import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

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
          // Determine title based on first name ending
          const title = profile.first_name.toLowerCase().endsWith('a') ? 'Frau' : 'Herr';
          setTitle(title);
          setUserFullName(`${profile.last_name}`);
        }
      }
    };

    setGreeting(getTimeBasedGreeting());
    loadUserProfile();

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>{greeting} {title} {userFullName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Willkommen in Ihrem Dashboard</p>
        </CardContent>
      </Card>
    </div>
  );
};