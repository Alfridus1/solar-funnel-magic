import { Autocomplete } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoofMap } from "@/components/roof/RoofMap";
import { RoofMetrics } from "@/components/roof/RoofMetrics";

interface RoofCheckContentProps {
  selectedAddress: string;
  setSelectedAddress: (address: string) => void;
  handleInputFocus: () => void;
  handleGeolocation: () => void;
  handleRoofOutlineComplete: (paths: google.maps.LatLng[][], roofDetails: { roofId: string; moduleCount: number }[]) => void;
  paths: google.maps.LatLng[][];
  metrics: any;
  handleContinue: () => void;
  onLog?: (message: string) => void;
}

export const RoofCheckContent = ({
  selectedAddress,
  setSelectedAddress,
  handleInputFocus,
  handleGeolocation,
  handleRoofOutlineComplete,
  paths,
  metrics,
  handleContinue,
  onLog
}: RoofCheckContentProps) => (
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
                  onFocus={handleInputFocus}
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