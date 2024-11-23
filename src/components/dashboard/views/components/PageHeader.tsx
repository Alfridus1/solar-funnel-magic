import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  onNewRequest: () => void;
}

export const PageHeader = ({ onNewRequest }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Meine Anfragen</h1>
      <Button onClick={onNewRequest} className="bg-solar-orange hover:bg-solar-orange/90">
        <Plus className="mr-2 h-4 w-4" />
        Neue Anfrage
      </Button>
    </div>
  );
};