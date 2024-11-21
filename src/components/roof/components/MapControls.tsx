import { Button } from "@/components/ui/button";
import { Plus, Trash2, Square } from "lucide-react";

interface MapControlsProps {
  isDrawing: boolean;
  polygonsExist: boolean;
  onStartDrawing: () => void;
  onDeleteLastRoof: () => void;
  onStartRectangle: () => void;
}

export const MapControls = ({
  isDrawing,
  polygonsExist,
  onStartDrawing,
  onDeleteLastRoof,
  onStartRectangle
}: MapControlsProps) => {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      <Button
        size="sm"
        onClick={onStartRectangle}
        disabled={isDrawing}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg whitespace-nowrap"
      >
        <Square className="mr-1 h-4 w-4" />
        Rechteckiges Dach
      </Button>

      <Button
        size="sm"
        onClick={onStartDrawing}
        disabled={isDrawing}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg whitespace-nowrap"
      >
        <Plus className="mr-1 h-4 w-4" />
        Freiform Dach
      </Button>
      
      {polygonsExist && (
        <Button
          size="sm"
          variant="destructive"
          onClick={onDeleteLastRoof}
          className="rounded-full shadow-lg whitespace-nowrap"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Letztes Dach entfernen
        </Button>
      )}
    </div>
  );
};