import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
import { Autocomplete } from "@react-google-maps/api";

interface HeroSectionProps {
  address: string;
  setAddress: (address: string) => void;
  autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>;
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
    <div id="address-input" className="max-w-4xl mx-auto text-center mb-12 space-y-6 animate-fade-up">
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
            <div className="relative">
              <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                  autocomplete.setComponentRestrictions({ country: 'de' });
                  autocomplete.setOptions({
                    types: ['address'],
                    fields: ['formatted_address', 'geometry']
                  });
                }}
                onPlaceChanged={() => {
                  const place = autocompleteRef.current?.getPlace();
                  if (place?.formatted_address) {
                    setAddress(place.formatted_address);
                  }
                  onPlaceSelected();
                }}
              >
                <Input
                  type="text"
                  placeholder="Ihre Adresse eingeben..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={handleGeolocation}
                  className="pl-10 h-12 text-lg w-full bg-white"
                />
              </Autocomplete>
            </div>

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
  );
};