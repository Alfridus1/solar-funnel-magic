import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onNewRequest: () => void;
}

export const EmptyState = ({ onNewRequest }: EmptyStateProps) => {
  return (
    <Card className="p-6 text-center">
      <p className="text-gray-600">Sie haben noch keine Anfragen erstellt.</p>
      <Button 
        onClick={onNewRequest} 
        className="mt-4 bg-solar-orange hover:bg-solar-orange/90"
      >
        Erste Anfrage erstellen
      </Button>
    </Card>
  );
};