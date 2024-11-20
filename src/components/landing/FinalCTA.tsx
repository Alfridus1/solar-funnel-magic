import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  handleAddressSubmit: () => void;
}

export const FinalCTA = ({ handleAddressSubmit }: FinalCTAProps) => {
  const scrollToAddress = () => {
    const element = document.getElementById('address-input');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <h2 className="text-3xl font-bold mb-6">
        Bereit für Ihre eigene Solaranlage?
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        Starten Sie jetzt und erhalten Sie ein unverbindliches Angebot
      </p>
      <Button
        onClick={scrollToAddress}
        className="h-12 px-8 text-lg bg-solar-orange hover:bg-solar-orange-dark transition-colors"
      >
        Jetzt Dach vermessen
      </Button>
    </div>
  );
};