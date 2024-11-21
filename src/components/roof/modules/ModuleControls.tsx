import React from 'react';
import { Camera, Square, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ModuleControlsProps {
  onRotationChange: (rotation: number) => void;
  moduleRotation: number;
  isManualPlacement: boolean;
  onTogglePlacement: () => void;
}

export const ModuleControls: React.FC<ModuleControlsProps> = ({
  onRotationChange,
  moduleRotation,
  isManualPlacement,
  onTogglePlacement
}) => {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
      <div className="flex gap-2">
        <Button
          variant="default"
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Square className="w-4 h-4 mr-2" />
          Rechteckiges Dach
        </Button>
        
        <Button
          variant="default"
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Camera className="w-4 h-4 mr-2" />
          Freiform Dach
        </Button>
        
        <Button variant="destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Letztes Dach entfernen
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw className="w-4 h-4" />
          <span>Modulausrichtung</span>
        </div>
        <Slider
          value={[moduleRotation]}
          onValueChange={([value]) => onRotationChange(value)}
          max={90}
          step={90}
          className="w-48"
        />
      </div>

      <Button
        variant="outline"
        onClick={onTogglePlacement}
        className={isManualPlacement ? "bg-green-100" : ""}
      >
        {isManualPlacement ? "Automatische Platzierung" : "Manuelle Platzierung"}
      </Button>
    </div>
  );
};