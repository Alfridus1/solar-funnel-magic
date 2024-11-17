import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLoadScript } from "@react-google-maps/api";
import { RoofMap } from "./roof/RoofMap";
import { RoofMetrics } from "./roof/RoofMetrics";
import { calculateRoofArea, calculateSolarMetrics } from "@/utils/roofCalculations";
import { Button } from "@/components/ui/button";

const libraries = ["drawing", "places"];

export const RoofCheck = ({ address }: { address: string }) => {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(true);
  const [coordinates, setCoordinates] = useState({ lat: 51.1657, lng: 10.4515 });
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

  useEffect(() => {
    if (isLoaded) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          const location = results[0].geometry.location;
          setCoordinates({ lat: location.lat(), lng: location.lng() });
          setAnalyzing(false);
        }
      });
    }
  }, [address, isLoaded]);

  const handleRoofOutlineComplete = (paths: google.maps.LatLng[][]) => {
    const totalRoofArea = calculateRoofArea(paths);
    const { usableArea, possiblePanels, monthlyProduction, annualSavings, kWp } = 
      calculateSolarMetrics(totalRoofArea);

    setMetrics({
      monthlyProduction,
      annualSavings,
      roofArea: usableArea,
      possiblePanels,
      kWp,
    });
  };

  const handleContinue = () => {
    navigate("/recommended-config", { 
      state: { 
        metrics,
        address 
      }
    });
  };

  if (!isLoaded) return <div>Laden...</div>;

  if (analyzing) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white animate-fade-up">
        <CardContent className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Vermesse Ihr Dach mit KI...
          </h3>
          <p className="text-gray-600">
            Bitte zeichnen Sie die Umrisse Ihres Daches ein
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 p-4 animate-fade-up">
      <Card className="bg-white">
        <CardContent className="p-4 sm:p-6">
          <RoofMap 
            coordinates={coordinates}
            onRoofOutlineComplete={handleRoofOutlineComplete}
          />
          <RoofMetrics {...metrics} />
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