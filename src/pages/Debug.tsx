import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/dashboard/views/types/Profile";

export const Debug = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Get session data
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);

      if (currentSession?.user) {
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
        } else {
          setProfile(profileData);
        }

        // Get employee data if it exists
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('*')
          .eq('profile_id', currentSession.user.id)
          .single();

        if (employeeError && employeeError.code !== 'PGRST116') {
          console.error('Employee fetch error:', employeeError);
        } else {
          setEmployee(employeeData);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Session Information</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <div className="space-y-2">
          <p><strong>Role:</strong> {profile?.role || 'Not set'}</p>
          <p><strong>Permissions:</strong> {profile?.permissions?.join(', ') || 'None'}</p>
        </div>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </Card>

      {employee && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Employee Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(employee, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};