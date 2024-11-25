import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Debug = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          console.log("User ID:", currentSession.user.id);

          // Get profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (profileError) {
            console.error("Profile Error:", profileError);
          } else {
            console.log("Profile Data:", profileData);
            setProfile(profileData);
          }

          // Get employee data if exists
          const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('*')
            .eq('profile_id', currentSession.user.id)
            .single();

          if (employeeError && employeeError.code !== 'PGRST116') {
            console.error("Employee Error:", employeeError);
          } else {
            console.log("Employee Data:", employeeData);
            setEmployee(employeeData);
          }
        }
      } catch (error) {
        console.error("Debug page error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Debug Information</h1>
        <Button onClick={handleLogout} variant="destructive">Logout</Button>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Authentication Status</h2>
        <div>
          <p><strong>Logged in:</strong> {session ? "Yes" : "No"}</p>
          {session && (
            <>
              <p><strong>User ID:</strong> {session.user.id}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
            </>
          )}
        </div>
      </Card>

      {profile && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <div className="space-y-2">
            <p><strong>Role:</strong> <Badge>{profile.role}</Badge></p>
            <p><strong>Permissions:</strong></p>
            <div className="flex flex-wrap gap-2">
              {profile.permissions?.map((permission: string) => (
                <Badge key={permission} variant="secondary">{permission}</Badge>
              ))}
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>First Name:</strong> {profile.first_name}</p>
                <p><strong>Last Name:</strong> {profile.last_name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
              </div>
              <div>
                <p><strong>Street:</strong> {profile.street}</p>
                <p><strong>House Number:</strong> {profile.house_number}</p>
                <p><strong>Postal Code:</strong> {profile.postal_code}</p>
                <p><strong>City:</strong> {profile.city}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {employee && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Employee Information</h2>
          <div className="space-y-2">
            <p><strong>Role:</strong> <Badge variant="outline">{employee.role}</Badge></p>
            <p><strong>Team ID:</strong> {employee.team_id}</p>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Commission Enabled:</strong> {employee.commission_enabled ? "Yes" : "No"}</p>
                <p><strong>Vacation Days:</strong> {employee.vacation_days}</p>
                <p><strong>Hours per Month:</strong> {employee.hours_per_month}</p>
              </div>
              <div>
                <p><strong>Has Company Car:</strong> {employee.has_company_car ? "Yes" : "No"}</p>
                <p><strong>Location:</strong> {employee.location}</p>
                <p><strong>MS Calendar Connected:</strong> {employee.ms_calendar_connected ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Session Data:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-medium">Profile Data:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-medium">Employee Data:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(employee, null, 2)}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};