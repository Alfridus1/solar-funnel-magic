import { useState, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RoofCheck } from "@/components/RoofCheck";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Benefits } from "@/components/Benefits";
import { Stats } from "@/components/Stats";
import { HeroSection } from "@/components/landing/HeroSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { TrustIndicators } from "@/components/landing/TrustIndicators";
import { useGeolocation } from "@/components/RoofCheck/hooks/useGeolocation";

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

  const onGeolocationSuccess = (formattedAddress: string) => {
    setAddress(formattedAddress);
    toast({
      title: "Erfolg",
      description: "Ihr Standort wurde erfolgreich erkannt.",
    });
  };

  const onGeolocationError = (errorMessage: string) => {
    toast({
      title: "Fehler",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const { handleGeolocation } = useGeolocation({
    onSuccess: onGeolocationSuccess,
    onError: onGeolocationError,
    toast
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
      <div className="container mx-auto px-4 py-12">
        <HeroSection
          address={address}
          setAddress={setAddress}
          autocompleteRef={autocompleteRef}
          onPlaceSelected={onPlaceSelected}
          handleAddressSubmit={handleAddressSubmit}
          handleGeolocation={handleGeolocation}
        />
        <TrustIndicators />
        <Stats />
        <Benefits />
        <Testimonials />
        <FAQ />
        <FinalCTA handleAddressSubmit={handleAddressSubmit} />
      </div>
    </div>
  );
}