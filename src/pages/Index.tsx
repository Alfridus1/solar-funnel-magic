import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LeadForm } from "@/components/LeadForm";
import { SystemConfigurator } from "@/components/SystemConfigurator";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Calendar, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const libraries = ["places"];

const Index = () => {
  const [address, setAddress] = useState("");
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formType, setFormType] = useState<"quote" | "consultation" | null>(null);
  const autocompleteRef = useRef(null);
  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries as ["places"],
  });

  const onPlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.formatted_address) {
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
    setShowConfiguration(true);
  };

  const handleOptionSelect = (type: "quote" | "consultation") => {
    setFormType(type);
    setShowLeadForm(true);
  };

  if (loadError) return <div>Fehler beim Laden der Karten</div>;
  if (!isLoaded) return <div>Laden...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Ihre perfekte Solaranlage in wenigen Minuten
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Erhalten Sie sofort eine passende Konfiguration für Ihr Zuhause
          </p>
        </div>

        {!showConfiguration ? (
          <Card className="max-w-md mx-auto p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Wo möchten Sie Ihre Solaranlage installieren?
            </h2>
            <div className="space-y-4">
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={onPlaceSelected}
                restrictions={{ country: "de" }}
              >
                <Input
                  type="text"
                  placeholder="Geben Sie Ihre Adresse ein"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full"
                />
              </Autocomplete>
              <Button
                onClick={handleAddressSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                Konfiguration anzeigen
              </Button>
            </div>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            {!showLeadForm ? (
              <>
                <SystemConfigurator />
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleOptionSelect("quote")}
                    className="p-8 h-auto flex flex-col items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    <Mail className="h-8 w-8" />
                    <div>
                      <div className="text-lg font-semibold">Angebot erhalten</div>
                      <div className="text-sm opacity-90">
                        Kostenloses Angebot per E-Mail
                      </div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleOptionSelect("consultation")}
                    className="p-8 h-auto flex flex-col items-center gap-4 bg-gradient-to-r from-green-600 to-teal-600 text-white"
                  >
                    <Calendar className="h-8 w-8" />
                    <div>
                      <div className="text-lg font-semibold">Beratungstermin</div>
                      <div className="text-sm opacity-90">
                        Persönliche Beratung vereinbaren
                      </div>
                    </div>
                  </Button>
                </div>
              </>
            ) : (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  {formType === "quote"
                    ? "Kostenloses Angebot anfordern"
                    : "Beratungstermin vereinbaren"}
                </h2>
                <LeadForm formType={formType} />
              </Card>
            )}
          </div>
        )}

        <div className="flex justify-center space-x-8 text-center max-w-4xl mx-auto mt-12">
          <div className="flex-1 p-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">60%</div>
            <div className="text-gray-600">Durchschnittliche Energieeinsparung</div>
          </div>
          <div className="flex-1 p-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">26%</div>
            <div className="text-gray-600">Staatliche Förderung</div>
          </div>
          <div className="flex-1 p-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Experten-Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;