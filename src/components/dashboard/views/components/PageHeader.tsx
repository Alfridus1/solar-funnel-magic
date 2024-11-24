import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

interface PageHeaderProps {
  onNewRequest: () => void;
  onConsultation: () => void;
}

export const PageHeader = ({ onNewRequest, onConsultation }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Meine Anfragen</h1>
      <div className="flex gap-4">
        <Button onClick={onConsultation} variant="outline" className="border-solar-orange text-solar-orange hover:bg-solar-orange/10">
          <Calendar className="mr-2 h-4 w-4" />
          Beratungstermin vereinbaren
        </Button>
        <Button onClick={onNewRequest} className="bg-solar-orange hover:bg-solar-orange/90">
          <Plus className="mr-2 h-4 w-4" />
          Neue Anfrage
        </Button>
      </div>
    </div>
  );
};