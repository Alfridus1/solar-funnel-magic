import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sun, Euro, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LeadMetrics {
  kWp: number;
  annualSavings: number;
  estimatedPrice: number;
}

interface LeadCalculation {
  id: string;
  created_at: string;
  metrics: LeadMetrics | null;
}

export const RequestsOverview = () => {
  const [calculations, setCalculations] = useState<LeadCalculation[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const { data, error } = await supabase
      .from('leads')
      .select('id, created_at, metrics')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Fehler beim Laden der Anfragen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Cast the data to match our interface with type checking
    const typedData: LeadCalculation[] = (data || []).map(item => ({
      id: item.id,
      created_at: item.created_at,
      metrics: item.metrics as LeadMetrics | null
    }));

    setCalculations(typedData);
  };

  const handleNewRequest = () => {
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meine Anfragen</h1>
        <Button onClick={handleNewRequest} className="bg-solar-orange hover:bg-solar-orange/90">
          <Plus className="mr-2 h-4 w-4" />
          Neue Anfrage
        </Button>
      </div>

      <div className="grid gap-6">
        {calculations.map((calc) => (
          <Card key={calc.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">
                Solaranlage vom {new Date(calc.created_at).toLocaleDateString('de-DE')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                  <Sun className="h-5 w-5 text-solar-orange" />
                  <div>
                    <p className="text-sm text-gray-600">Anlagengröße</p>
                    <p className="font-semibold">{calc.metrics?.kWp || 0} kWp</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <Euro className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Geschätzter Preis</p>
                    <p className="font-semibold">{calc.metrics?.estimatedPrice?.toLocaleString('de-DE') || 0}€</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Jährliche Einsparung</p>
                    <p className="font-semibold">{calc.metrics?.annualSavings?.toLocaleString('de-DE') || 0}€</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {calculations.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-gray-600">Sie haben noch keine Anfragen erstellt.</p>
            <Button 
              onClick={handleNewRequest} 
              className="mt-4 bg-solar-orange hover:bg-solar-orange/90"
            >
              Erste Anfrage erstellen
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};