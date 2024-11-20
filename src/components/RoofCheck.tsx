import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useLoadScript } from "@react-google-maps/api";
import { RoofMap } from "./roof/RoofMap";
import { RoofMetrics } from "./roof/RoofMetrics";
import {
  calculateRoofArea,
  calculateSolarMetrics,
} from "@/utils/roofCalculations";
import { Button } from "@/components/ui/button";

const libraries = ["drawing", "places"];

interface RoofCheckProps {
  address: string;
  onLog?: (message: string) => void;
}

export const RoofCheck = ({ address, onLog }: RoofCheckProps) => {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 51.1657, lng: 10.4515 });
  const [roofDetails, setRoofDetails] = useState<{ roofId: string; moduleCount: number }[]>([]);
  const [metrics, setMetrics] = useState({
    monthlyProduction: 0,
    annualSavings: 0,
    roofArea: 0,
    possiblePanels: 0,
    kWp: 0,
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries as ["drawing", "places"],
  });

  const geocodeAddress = useCallback(() => {
    if (!isLoaded) return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        const location = results[0].geometry.location;
        setCoordinates({ lat: location.lat(), lng: location.lng() });
        onLog?.(`Adresse gefunden: ${location.lat()}, ${location.lng()}`);
      } else {
        onLog?.(`Geocoding Fehler: ${status}`);
      }
    });
  }, [address, isLoaded, onLog]);

  useEffect(() => {
    if (isLoaded) {
      onLog?.("Google Maps API geladen");
      geocodeAddress();
    }
  }, [isLoaded, geocodeAddress]);

  const handleRoofOutlineComplete = useCallback((
    paths: google.maps.LatLng[][],
    newRoofDetails: { roofId: string; moduleCount: number }[]
  ) => {
    const totalRoofArea = calculateRoofArea(paths);
    const totalModules = newRoofDetails.reduce((sum, roof) => sum + roof.moduleCount, 0);
    
    const {
      usableArea,
      monthlyProduction,
      annualSavings,
      kWp,
    } = calculateSolarMetrics(totalRoofArea);

    setRoofDetails(newRoofDetails);
    setMetrics({
      monthlyProduction,
      annualSavings,
      roofArea: usableArea,
      possiblePanels: totalModules,
      kWp,
    });

    onLog?.(`Dachfläche berechnet: ${totalRoofArea}m²`);
    onLog?.(`Mögliche Module: ${totalModules}`);
    onLog?.(`Metriken berechnet: ${kWp}kWp, ${monthlyProduction}kWh/Monat`);
  }, [onLog]);

  const handleContinue = useCallback(() => {
    onLog?.("Navigation zur Konfigurationsseite");
    navigate("/recommended-config", {
      state: {
        metrics,
        address,
        roofDetails,
      },
    });
  }, [navigate, metrics, address, roofDetails, onLog]);

  if (!isLoaded) {
    return <div>Laden...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 p-4 animate-fade-up">
      <Card className="bg-white">
        <CardContent className="p-4 sm:p-6">
          <RoofMap
            coordinates={coordinates}
            onRoofOutlineComplete={handleRoofOutlineComplete}
            onLog={onLog}
          />
          <RoofMetrics {...metrics} roofDetails={roofDetails} />
          {metrics.roofArea > 0 && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              >
                Ihre optimale Konfiguration anzeigen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};