import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Overview = () => {
  const { data: profile } = useQuery({
    queryKey: ['employee-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('employees')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email
          )
        `)
        .eq('profile_id', user.id)
        .single();

      return profile;
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Willkommen{profile?.profiles?.first_name ? `, ${profile.profiles.first_name}` : ''}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Aktuelle Aufgaben</h3>
          <p className="text-muted-foreground">Keine ausstehenden Aufgaben</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Team Updates</h3>
          <p className="text-muted-foreground">Keine neuen Updates</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Nächste Termine</h3>
          <p className="text-muted-foreground">Keine anstehenden Termine</p>
        </Card>
      </div>
    </div>
  );
};