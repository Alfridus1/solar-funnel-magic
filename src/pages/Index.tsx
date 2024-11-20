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

export function Index() {
  const [address, setAddress] = useState("");
  const [showRoofCheck, setShowRoofCheck] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries as ["drawing", "places"],
  });

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
        const geocoder = new google.maps.Geocoder();
        try {
          const response = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });
          if (response.results[0]) {
            const newAddress = response.results[0].formatted_address;
            setAddress(newAddress);
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
      }
    );
  };

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
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 space-y-6 animate-fade-up">
          <img 
            src="/lovable-uploads/230bf2e3-b64a-4f51-bb2f-f246df2597be.png" 
            alt="COPPEN Logo" 
            className="h-24 mx-auto mb-8" 
          />
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Ihre <span className="text-solar-orange">Solaranlage</span> in wenigen Minuten planen
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Zeichnen Sie Ihr Dach ein und erhalten Sie sofort Ihre optimale Konfiguration
          </p>

          {/* Main CTA Card */}
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
                      onFocus={handleGeolocation}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                </Autocomplete>

                <Button
                  onClick={handleAddressSubmit}
                  className="w-full h-12 text-lg bg-solar-orange hover:bg-solar-orange-dark transition-colors"
                >
                  Dach vermessen
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="py-8 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-solar-orange" />
              <span>TÜV-zertifiziert</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-solar-orange" />
              <span>10 Jahre Garantie</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-solar-orange" />
              <span>100% Kundenzufriedenheit</span>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <Stats />

        {/* Benefits Section */}
        <Benefits />

        {/* Social Proof Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* Final CTA Section */}
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-3xl font-bold mb-6">
            Bereit für Ihre eigene Solaranlage?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Starten Sie jetzt und erhalten Sie ein unverbindliches Angebot
          </p>
          <Button
            onClick={handleAddressSubmit}
            className="h-12 px-8 text-lg bg-solar-orange hover:bg-solar-orange-dark transition-colors"
          >
            Jetzt Dach vermessen
          </Button>
        </div>
      </div>
    </div>
  );
}