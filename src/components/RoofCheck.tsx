import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoofMap } from "@/components/roof/RoofMap";
import { RoofMetrics } from "@/components/roof/RoofMetrics";
import { calculateRoofArea, calculateSolarMetrics } from "@/utils/roofCalculations";
import { Input } from "@/components/ui/input";
import { Autocomplete } from "@react-google-maps/api";
import { useToast } from "@/hooks/use-toast";

interface RoofCheckProps {
  address: string;
  onLog?: (message: string) => void;
}

export const RoofCheck = ({ address, onLog }: RoofCheckProps) => {
  const [selectedAddress, setSelectedAddress] = useState(address);
  const [paths, setPaths] = useState<google.maps.LatLng[][]>([]);
  const [metrics, setMetrics] = useState({
    monthlyProduction: 0,
    annualSavings: 0,
    roofArea: 0,
    possiblePanels: 0,
    kWp: 0,
    roofDetails: [] as { roofId: string; moduleCount: number }[]
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoofOutlineComplete = useCallback(
    (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => {
      setPaths(paths);
      const totalArea = calculateRoofArea(paths);
      const calculatedMetrics = calculateSolarMetrics(totalArea);
      setMetrics({
        ...calculatedMetrics,
        roofArea: totalArea,
        roofDetails
      });
    },
    []
  );

  const reverseGeocode = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        const newAddress = response.results[0].formatted_address;
        setSelectedAddress(newAddress);
        onLog?.(`Standort erkannt: ${newAddress}`);
        toast({
          title: "Erfolg",
          description: "Ihr Standort wurde erfolgreich erkannt.",
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Fehler",
        description: "Die Adresse konnte nicht ermittelt werden.",
        variant: "destructive",
      });
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Nicht unterstützt",
        description: "Ihr Browser unterstützt keine Standorterkennung.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Standorterkennung",
      description: "Ihr Standort wird ermittelt...",
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Ihr Standort konnte nicht ermittelt werden.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Bitte erlauben Sie den Zugriff auf Ihren Standort.";
        }
        toast({
          title: "Fehler",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleContinue = () => {
    if (paths.length === 0) return;

    navigate("/recommended-config", {
      state: {
        metrics,
        address: selectedAddress,
      },
    });
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setSelectedAddress(place.formatted_address);
      onLog?.(`Adresse ausgewählt: ${place.formatted_address}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-5xl mx-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Zeichnen Sie Ihr Dach ein</h1>
              <p className="text-gray-600 mb-4">
                Klicken Sie auf die Ecken Ihres Daches, um die Fläche einzuzeichnen
              </p>
              <div className="flex gap-2">
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocomplete.setComponentRestrictions({ country: "de" });
                  }}
                  onPlaceChanged={() => {
                    const autocomplete = document.querySelector('input') as HTMLInputElement;
                    const place = autocomplete?.value;
                    if (place) {
                      setSelectedAddress(place);
                      onLog?.(`Neue Adresse ausgewählt: ${place}`);
                    }
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Geben Sie Ihre Adresse ein..."
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </Autocomplete>
                <Button 
                  onClick={handleGeolocation}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  Standort erkennen
                </Button>
              </div>
            </div>

            <RoofMap
              address={selectedAddress}
              onRoofOutlineComplete={handleRoofOutlineComplete}
              onLog={onLog}
            />

            {paths.length > 0 && (
              <>
                <RoofMetrics {...metrics} />
                <div className="flex justify-end">
                  <Button
                    onClick={handleContinue}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Weiter zur Konfiguration
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};