import { Button } from "@/components/ui/button";

interface CallToActionProps {
  onQuoteRequest: () => void;
  onConsultationRequest: () => void;
}

export const CallToAction = ({ onQuoteRequest, onConsultationRequest }: CallToActionProps) => {
  return (
    <section className="py-16 bg-gradient-to-br from-solar-blue-50 to-white rounded-3xl">
      <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold">
          Bereit für Ihre eigene Solaranlage?
        </h2>
        <p className="text-lg text-gray-600">
          Lassen Sie sich von unseren Experten beraten und erhalten Sie ein 
          maßgeschneidertes Angebot für Ihr Zuhause.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-solar-orange hover:bg-solar-orange-dark"
            onClick={onQuoteRequest}
          >
            Kostenloses Angebot
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-solar-orange text-solar-orange hover:bg-solar-orange/10"
            onClick={onConsultationRequest}
          >
            Beratungstermin vereinbaren
          </Button>
        </div>
      </div>
    </section>
  );
};