import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LeadForm } from "@/components/LeadForm";
import { SystemConfigurator } from "@/components/SystemConfigurator";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { ArrowRight, Home, Sun, Sparkles, Battery } from "lucide-react";
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
      <div className="container mx-auto px-4 py-12">
        {!showConfiguration ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4 animate-fade-up">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
                Ihre <span className="text-blue-600">Solaranlage</span> in wenigen Minuten konfigurieren
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Erhalten Sie eine maßgeschneiderte Lösung für Ihr Zuhause
              </p>
            </div>

            <Card className="max-w-xl mx-auto p-8 shadow-lg bg-white/90 backdrop-blur animate-fade-up">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Wo möchten Sie Ihre Solaranlage installieren?
                  </h2>
                  <p className="text-gray-600">
                    Geben Sie Ihre Adresse ein, um Ihre optimale Konfiguration zu erhalten
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
                    Solar-Potenzial berechnen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white/80 backdrop-blur shadow-sm">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Sun className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold">Maximale Effizienz</h3>
                <p className="text-gray-600">Optimale Ausrichtung für maximalen Ertrag</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white/80 backdrop-blur shadow-sm">
                <div className="p-3 bg-green-100 rounded-full">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Staatliche Förderung</h3>
                <p className="text-gray-600">Bis zu 26% Förderung sichern</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white/80 backdrop-blur shadow-sm">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Battery className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Energieunabhängig</h3>
                <p className="text-gray-600">Speichern Sie Ihren eigenen Strom</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {!showLeadForm ? (
              <SystemConfigurator />
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
      </div>
    </div>
  );
};

export default Index;