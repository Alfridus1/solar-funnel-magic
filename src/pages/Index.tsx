import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Home, Users, Award, CheckCircle, MessageSquare, Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RoofCheck } from "@/components/RoofCheck";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Benefits } from "@/components/Benefits";
import { Stats } from "@/components/Stats";

const libraries = ["drawing", "places"];

const Index = () => {
  const [address, setAddress] = useState("");
  const [showRoofCheck, setShowRoofCheck] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries as ["drawing", "places"],
  });

  const onPlaceSelected = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address) {
      setAddress(place.formatted_address);
    }
  };

  const handleAddressSubmit = () => {
    if (!address) {
      toast({
        title: "Bitte geben Sie eine Adresse ein",
        variant: "destructive",
      });
      return;
    }
    setShowRoofCheck(true);
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p className="text-red-600">
            Fehler beim Laden der Karte. Bitte versuchen Sie es später erneut.
          </p>
        </Card>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p>Laden...</p>
        </Card>
      </div>
    );
  }

  if (showRoofCheck) {
    return <RoofCheck address={address} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12 space-y-6 animate-fade-up">
          <img src="/logo.svg" alt="Logo" className="h-16 mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Ihre <span className="text-blue-600">Solaranlage</span> in wenigen Minuten planen
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Zeichnen Sie Ihr Dach ein und erhalten Sie sofort Ihre optimale Konfiguration
          </p>

          <Card className="max-w-xl mx-auto p-8 shadow-lg bg-white/90 backdrop-blur">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Wo möchten Sie Ihre Solaranlage installieren?
                </h2>
                <p className="text-gray-600">
                  Geben Sie Ihre Adresse ein, um Ihr Dach zu vermessen
                </p>
              </div>

              <div className="space-y-4">
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={onPlaceSelected}
                  restrictions={{ country: "de" }}
                >
                  <div className="relative">
                    <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Ihre Adresse eingeben..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                </Autocomplete>

                <Button
                  onClick={handleAddressSubmit}
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Dach vermessen
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Section */}
        <Stats />

        {/* Benefits Section */}
        <Benefits />

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />
      </div>
    </div>
  );
};

export default Index;