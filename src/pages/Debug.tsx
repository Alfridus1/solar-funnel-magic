import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/dashboard/views/types/Profile";
import { useToast } from "@/components/ui/use-toast";

export const Debug = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [employee, setEmployee] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get session data
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          // Get profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            toast({
              title: "Error fetching profile",
              description: profileError.message,
              variant: "destructive",
            });
          } else {
            setProfile(profileData);
          }

          if (profileData) {
            // Get employee data if profile exists
            const { data: employeeData, error: employeeError } = await supabase
              .from('employees')
              .select('*')
              .eq('profile_id', currentSession.user.id)
              .maybeSingle();

            if (employeeError && employeeError.code !== 'PGRST116') {
              console.error('Employee fetch error:', employeeError);
              toast({
                title: "Error fetching employee data",
                description: employeeError.message,
                variant: "destructive",
              });
            } else {
              setEmployee(employeeData);
            }
          }
        }
      } catch (error: any) {
        console.error('Error in fetchData:', error);
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

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
        {profile ? (
          <>
            <div className="space-y-2">
              <p><strong>Role:</strong> {profile.role || 'Not set'}</p>
              <p><strong>Permissions:</strong> {profile.permissions?.join(', ') || 'None'}</p>
            </div>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </>
        ) : (
          <p className="text-gray-500">No profile data found</p>
        )}
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