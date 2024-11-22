import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Lead {
  id: string;
  address: string;
  metrics: {
    kWp: number;
    roofArea: number;
    monthlyProduction: number;
    annualSavings: number;
  };
  created_at: string;
}

export const SolarSystemOverview = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { data: lead, isLoading } = useQuery({
    queryKey: ['user-lead'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data as Lead;
    }
  });

  useEffect(() => {
    if (lead?.address && !coordinates) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: lead.address }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          setCoordinates({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        }
      });
    }
  }, [lead?.address, coordinates]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!lead) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Keine Solaranlagen-Anfrage gefunden.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Solaranlage</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Standort</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] rounded-lg overflow-hidden">
              {coordinates && (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={coordinates}
                  zoom={18}
                  options={{
                    mapTypeId: "satellite",
                    mapTypeControl: false,
                    streetViewControl: false
                  }}
                  onLoad={() => setMapLoaded(true)}
                >
                  <Marker position={coordinates} />
                </GoogleMap>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600">{lead.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anlagendetails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Anlagengröße</p>
              <p className="text-xl font-semibold">{lead.metrics.kWp} kWp</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dachfläche</p>
              <p className="text-xl font-semibold">{lead.metrics.roofArea} m²</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monatliche Produktion</p>
              <p className="text-xl font-semibold">{lead.metrics.monthlyProduction} kWh</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Jährliche Einsparungen</p>
              <p className="text-xl font-semibold">{lead.metrics.annualSavings}€</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};