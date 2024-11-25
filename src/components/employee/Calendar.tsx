import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";

const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
const MICROSOFT_TENANT_ID = import.meta.env.VITE_MICROSOFT_TENANT_ID;
const REDIRECT_URI = `${import.meta.env.VITE_APP_URL}/auth/callback`;

export const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkCalendarConnection();
    handleOAuthCallback();
  }, []);

  const checkCalendarConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Nicht authentifiziert",
          description: "Bitte melden Sie sich an.",
          variant: "destructive",
        });
        return;
      }

      const { data: employees, error } = await supabase
        .from('employees')
        .select('ms_calendar_connected')
        .eq('profile_id', user.id)
        .single();

      if (error) {
        console.error('Error checking calendar connection:', error);
        return;
      }

      setIsConnected(employees?.ms_calendar_connected || false);
    } catch (error) {
      console.error('Error checking calendar connection:', error);
    }
  };

  const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (!code) return;

    setIsConnecting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht authentifiziert');

      const { data: employees, error: employeeError } = await supabase
        .from('employees')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (employeeError) throw employeeError;
      if (!employees) throw new Error('Mitarbeiter nicht gefunden');

      const { error } = await supabase.functions.invoke('ms-calendar-auth', {
        body: { code, employeeId: employees.id }
      });

      if (error) throw error;

      setIsConnected(true);
      toast({
        title: "Kalender verbunden",
        description: "Ihr Office365-Kalender wurde erfolgreich verknüpft.",
      });

      // Clean up URL
      window.history.replaceState({}, document.title, '/dashboard/employee#calendar');
    } catch (error: any) {
      console.error('Error connecting calendar:', error);
      toast({
        title: "Fehler bei der Kalenderverknüpfung",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const connectCalendar = () => {
    if (!MICROSOFT_CLIENT_ID || !MICROSOFT_TENANT_ID) {
      toast({
        title: "Konfigurationsfehler",
        description: "Die Microsoft-Integration ist nicht korrekt konfiguriert.",
        variant: "destructive",
      });
      return;
    }

    const scope = encodeURIComponent('Calendars.ReadWrite offline_access');
    const authUrl = `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize` +
      `?client_id=${MICROSOFT_CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${scope}` +
      `&response_mode=query`;

    window.location.href = authUrl;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kalender</h1>
      
      <div className="grid gap-6">
        {!isConnected && (
          <Card className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">Office365-Kalender verknüpfen</h2>
              <p className="text-gray-600">
                Verknüpfen Sie Ihren Office365-Kalender, um Ihre Termine zu synchronisieren.
              </p>
              <Button 
                onClick={connectCalendar} 
                disabled={isConnecting}
                className="w-full sm:w-auto"
              >
                {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isConnecting ? "Wird verbunden..." : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Mit Office365 verbinden
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>
      </div>
    </div>
  );
};