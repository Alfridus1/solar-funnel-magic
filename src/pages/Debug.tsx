import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function Debug() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setProfile(null);
        setEmployee(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch employee data if it exists
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('profile_id', userId)
        .single();

      if (!employeeError) {
        setEmployee(employeeData);
      }
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden der Benutzerdaten",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Debug Informationen</h1>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Auth Status</h2>
          <div className="space-y-2">
            <p><strong>Angemeldet:</strong> {session ? "Ja" : "Nein"}</p>
            <p><strong>User ID:</strong> {session?.user?.id || "Nicht angemeldet"}</p>
            <p><strong>Email:</strong> {session?.user?.email || "Nicht angemeldet"}</p>
            {session && (
              <Button variant="destructive" onClick={handleSignOut}>
                Abmelden
              </Button>
            )}
          </div>
        </Card>

        {profile && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profil Informationen</h2>
            <div className="space-y-2">
              <p><strong>Rolle:</strong> {profile.role || "Keine Rolle"}</p>
              <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
              <p><strong>Berechtigungen:</strong> {profile.permissions?.join(", ") || "Keine Berechtigungen"}</p>
              <pre className="bg-gray-100 p-4 rounded-md mt-4 overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          </Card>
        )}

        {employee && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mitarbeiter Informationen</h2>
            <div className="space-y-2">
              <p><strong>Rolle:</strong> {employee.role}</p>
              <p><strong>Team ID:</strong> {employee.team_id || "Kein Team"}</p>
              <pre className="bg-gray-100 p-4 rounded-md mt-4 overflow-auto">
                {JSON.stringify(employee, null, 2)}
              </pre>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}