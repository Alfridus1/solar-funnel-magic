import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ProgressBar";
import { RoofCheck } from "@/components/RoofCheck";
import { LeadForm } from "@/components/LeadForm";
import { SystemConfigurator } from "@/components/SystemConfigurator"; // Import the new SystemConfigurator component
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const libraries = ["places"];

const Index = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const totalSteps = 3;
  const autocompleteRef = useRef(null);
  const navigate = useNavigate();

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

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate("/configurator/consumption");
    }
  };

  if (loadError) return <div>Fehler beim Laden der Karten</div>;
  if (!isLoaded) return <div>Laden...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Sparen Sie mit Solarenergie
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Schließen Sie sich tausenden Hausbesitzern an, die bis zu 60% ihrer Energiekosten mit Solarenergie sparen
          </p>
        </div>

        <ProgressBar currentStep={step} totalSteps={totalSteps} />

        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
          {step === 1 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-semibold mb-4">
                Lassen Sie uns Ihr Solarpotenzial prüfen
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
                  onClick={nextStep}
                  disabled={!address}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  Dach prüfen
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up w-full max-w-7xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Analyse Ihres Daches</h2>
              <RoofCheck address={address} />
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Konfigurieren Sie Ihr System</h2>
                <SystemConfigurator />
              </div>
              <Button
                onClick={nextStep}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                Solarangebot erhalten
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-semibold mb-4">
                Kostenloses Solarangebot erhalten
              </h2>
              <LeadForm />
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-8 text-center max-w-4xl mx-auto">
          <div className="flex-1 p-4">
            <div className="text-4xl font-bold text-solar-orange mb-2">60%</div>
            <div className="text-gray-600">Durchschnittliche Energieeinsparung</div>
          </div>
          <div className="flex-1 p-4">
            <div className="text-4xl font-bold text-solar-orange mb-2">26%</div>
            <div className="text-gray-600">Staatliche Förderung</div>
          </div>
          <div className="flex-1 p-4">
            <div className="text-4xl font-bold text-solar-orange mb-2">24/7</div>
            <div className="text-gray-600">Experten-Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
