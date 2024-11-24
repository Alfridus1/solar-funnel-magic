import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { calculateRoofArea, calculateSolarMetrics } from "@/utils/roofCalculations";
import { RoofCheckContent } from "./RoofCheck/RoofCheckContent";
import { RoofCheckLoading } from "./RoofCheck/RoofCheckLoading";
import { saveConfigToCookie } from "@/utils/configCookieManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const libraries: ("places" | "drawing" | "geometry")[] = ["places", "drawing", "geometry"];

interface RoofCheckProps {
  address: string;
  onLog?: (message: string) => void;
}

interface Metrics {
  monthlyProduction: number;
  annualSavings: number;
  roofArea: number;
  possiblePanels: number;
  kWp: number;
  roofDetails: { roofId: string; moduleCount: number; kWp: number }[];
}

export const RoofCheck = ({ address, onLog }: RoofCheckProps) => {
  const [paths, setPaths] = useState<google.maps.LatLng[][]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    monthlyProduction: 0,
    annualSavings: 0,
    roofArea: 0,
    possiblePanels: 0,
    kWp: 0,
    roofDetails: []
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  const handleRoofOutlineComplete = useCallback(
    (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => {
      setPaths(paths);
      const totalArea = calculateRoofArea(paths);
      const calculatedMetrics = calculateSolarMetrics(totalArea);
      const updatedMetrics = {
        ...calculatedMetrics,
        roofArea: Math.round(totalArea * 100) / 100, // Runden auf 2 Nachkommastellen
        roofDetails
      };
      setMetrics(updatedMetrics);
      onLog?.("Metrics calculated: " + JSON.stringify(updatedMetrics));
      
      // Save configuration to cookie
      saveConfigToCookie({
        metrics: updatedMetrics,
        address,
      });

      // Prüfen ob der Nutzer eingeloggt ist
      if (!isAuthenticated) {
        toast({
          title: "Anmeldung erforderlich",
          description: "Bitte melden Sie sich an oder erstellen Sie einen Account, um Ihre persönliche Auswertung zu sehen.",
        });
        navigate("/login", {
          state: {
            returnTo: "/solar-showcase",
            metrics: updatedMetrics,
            address,
          }
        });
        return;
      }

      // Wenn eingeloggt, direkt zur Auswertung
      navigate("/solar-showcase", {
        state: {
          metrics: updatedMetrics,
          address,
        },
      });
    },
    [onLog, navigate, address, isAuthenticated, toast]
  );

  if (loadError) {
    return (
      <Card className="max-w-5xl mx-auto p-6">
        <div className="text-center text-red-600">
          Fehler beim Laden der Google Maps API. Bitte versuchen Sie es später erneut.
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return <RoofCheckLoading />;
  }

  return (
    <RoofCheckContent
      address={address}
      handleRoofOutlineComplete={handleRoofOutlineComplete}
      paths={paths}
      metrics={metrics}
      onLog={onLog}
    />
  );
};