import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { roleTranslations } from "@/utils/roleTranslations";

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
      // Fetch profile data with permissions
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
        .select(`
          *,
          employee_permissions (
            permissions
          )
        `)
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

  const renderPermissionsBadges = (permissions: string[]) => {
    return permissions?.map((permission: string) => (
      <Badge key={permission} variant="secondary" className="mr-2 mb-2">
        {permission}
      </Badge>
    ));
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
            <p><strong>Auth Provider:</strong> {session?.user?.app_metadata?.provider || "Nicht verfügbar"}</p>
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
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-700">Rolle</p>
                <Badge variant="outline" className="mt-1">
                  {roleTranslations[profile.role] || profile.role || "Keine Rolle"}
                </Badge>
              </div>
              
              <div>
                <p className="font-medium text-gray-700">Berechtigungen</p>
                <div className="mt-1">
                  {renderPermissionsBadges(profile.permissions)}
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-700">Persönliche Daten</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Telefon:</strong> {profile.phone || "Nicht angegeben"}</p>
                  <p><strong>Jahresverbrauch:</strong> {profile.annual_consumption || "Nicht angegeben"} kWh</p>
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-700">Adresse</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <p><strong>Straße:</strong> {profile.street || "Nicht angegeben"}</p>
                  <p><strong>Hausnummer:</strong> {profile.house_number || "Nicht angegeben"}</p>
                  <p><strong>PLZ:</strong> {profile.postal_code || "Nicht angegeben"}</p>
                  <p><strong>Stadt:</strong> {profile.city || "Nicht angegeben"}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {employee && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mitarbeiter Informationen</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-700">Position</p>
                <Badge variant="outline" className="mt-1">
                  {roleTranslations[employee.role] || employee.role}
                </Badge>
              </div>

              <div>
                <p className="font-medium text-gray-700">Zusätzliche Berechtigungen</p>
                <div className="mt-1">
                  {employee.employee_permissions?.[0]?.permissions && 
                    renderPermissionsBadges(Object.keys(employee.employee_permissions[0].permissions))}
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-700">Mitarbeiter Details</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <p><strong>Mitarbeiter ID:</strong> {employee.id}</p>
                  <p><strong>Team ID:</strong> {employee.team_id || "Kein Team"}</p>
                  <p><strong>Standort:</strong> {employee.location || "Nicht angegeben"}</p>
                  <p><strong>Provision aktiviert:</strong> {employee.commission_enabled ? "Ja" : "Nein"}</p>
                  <p><strong>Urlaubstage:</strong> {employee.vacation_days || 0}</p>
                  <p><strong>Arbeitsstunden/Monat:</strong> {employee.hours_per_month || 0}</p>
                  <p><strong>Firmenwagen:</strong> {employee.has_company_car ? "Ja" : "Nein"}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}