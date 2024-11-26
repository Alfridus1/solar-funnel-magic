import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/components/RoofCheck/hooks/useGeolocation";

export const Index = () => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCurrentLocation } = useGeolocation();

  const handleCalculateClick = () => {
    if (!address.trim()) {
      toast({
        title: "Adresse erforderlich",
        description: "Bitte geben Sie eine Adresse ein oder nutzen Sie die Standorterkennung.",
        variant: "destructive",
      });
      return;
    }

    navigate("/roof-check", {
      state: { address }
    });
  };

  const handleLocationClick = async () => {
    try {
      const address = await getCurrentLocation();
      setAddress(address);
      toast({
        title: "Standort erkannt",
        description: "Ihre Adresse wurde automatisch erkannt.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler bei der Standorterkennung",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Berechnen Sie Ihr Solarpotenzial
          </h1>
          <p className="text-xl text-gray-600">
            Geben Sie Ihre Adresse ein und erhalten Sie eine kostenlose Analyse Ihres Solarpotenzials
          </p>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ihre Adresse eingeben..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleLocationClick}
              className="shrink-0"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Standort
            </Button>
          </div>

          <Button
            onClick={handleCalculateClick}
            disabled={!address.trim()}
            className="bg-solar-orange hover:bg-solar-orange/90 text-white px-8 py-6 text-lg"
          >
            Jetzt berechnen
          </Button>
        </div>
      </div>
    </div>
  );
};