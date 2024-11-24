import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calculateRoofArea, calculateSolarMetrics } from "@/utils/roofCalculations";
import { RoofCheckContent } from "./RoofCheck/RoofCheckContent";
import { RoofCheckLoading } from "./RoofCheck/RoofCheckLoading";
import { saveConfigToCookie } from "@/utils/configCookieManager";
import { useToast } from "@/components/ui/use-toast";

const libraries: ("places" | "drawing" | "geometry")[] = ["places", "drawing", "geometry"];

interface RoofCheckProps {
  address: string;
  onLog?: (message: string) => void;
}

export const RoofCheck = ({ address, onLog }: RoofCheckProps) => {
  const [paths, setPaths] = useState<google.maps.LatLng[][]>([]);
  const [metrics, setMetrics] = useState({
    monthlyProduction: 0,
    annualSavings: 0,
    roofArea: 0,
    possiblePanels: 0,
    kWp: 0,
    roofDetails: []
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleRoofOutlineComplete = useCallback(
    (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number; kWp: number }[]) => {
      setPaths(paths);
      const totalArea = calculateRoofArea(paths);
      const calculatedMetrics = calculateSolarMetrics(totalArea);
      const updatedMetrics = {
        ...calculatedMetrics,
        roofArea: Math.round(totalArea * 100) / 100,
        roofDetails
      };
      setMetrics(updatedMetrics);
      onLog?.("Metrics calculated: " + JSON.stringify(updatedMetrics));
      
      saveConfigToCookie({
        metrics: updatedMetrics,
        address,
      });

      toast({
        title: "Dachfläche berechnet",
        description: `${roofDetails.length} Dachflächen mit insgesamt ${updatedMetrics.roofArea}m² wurden erfolgreich vermessen.`,
      });
    },
    [onLog, address, toast]
  );

  const handleContinue = () => {
    if (paths.length === 0) {
      toast({
        title: "Keine Dachfläche eingezeichnet",
        description: "Bitte zeichnen Sie mindestens eine Dachfläche ein.",
        variant: "destructive",
      });
      return;
    }

    navigate("/solar-showcase", {
      state: {
        metrics,
        address,
      },
    });
  };

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
    <div className="space-y-6">
      <RoofCheckContent
        address={address}
        handleRoofOutlineComplete={handleRoofOutlineComplete}
        paths={paths}
        metrics={metrics}
        onLog={onLog}
      />
      
      {paths.length > 0 && (
        <div className="flex justify-center">
          <Button 
            onClick={handleContinue}
            className="bg-solar-orange hover:bg-solar-orange-dark text-white px-8 py-3 rounded-lg text-lg"
          >
            Weiter zur Konfiguration
          </Button>
        </div>
      )}
    </div>
  );
};