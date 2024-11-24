import { MutableRefObject } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Autocomplete } from "@react-google-maps/api";
import { libraries } from "@/hooks/useGoogleMaps";

interface HeroSectionProps {
  address: string;
  setAddress: (address: string) => void;
  autocompleteRef: MutableRefObject<google.maps.places.Autocomplete | null>;
  onPlaceSelected: () => void;
  handleAddressSubmit: () => void;
  handleGeolocation: () => void;
}

export const HeroSection = ({
  address,
  setAddress,
  autocompleteRef,
  onPlaceSelected,
  handleAddressSubmit,
  handleGeolocation,
}: HeroSectionProps) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Ihre Solaranlage in wenigen Schritten
      </h1>
      <p className="text-xl text-gray-600 mb-12">
        Berechnen Sie jetzt Ihr individuelles Angebot
      </p>

      <Card className="p-6 mb-8" id="address-input">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={onPlaceSelected}
              options={{ 
                componentRestrictions: { country: "de" },
                fields: ["formatted_address", "geometry"]
              }}
            >
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ihre Adresse eingeben"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-solar-orange"
                />
              </div>
            </Autocomplete>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleGeolocation}
              className="whitespace-nowrap"
            >
              Standort verwenden
            </Button>
            <Button
              onClick={handleAddressSubmit}
              className="bg-solar-orange hover:bg-solar-orange-dark transition-colors whitespace-nowrap"
            >
              Jetzt berechnen
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};