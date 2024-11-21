import React from 'react';
import { Card } from '@/components/ui/card';

interface RoofStat {
  id: string;
  moduleCount: number;
  power: number;
}

interface ModuleStatsProps {
  roofStats: RoofStat[];
}

export const ModuleStats: React.FC<ModuleStatsProps> = ({ roofStats }) => {
  const totalPower = roofStats.reduce((sum, stat) => sum + stat.power, 0);
  const totalModules = roofStats.reduce((sum, stat) => sum + stat.moduleCount, 0);

  return (
    <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg space-y-4">
      <div>
        <h3 className="font-bold mb-2">Gesamtübersicht:</h3>
        <p className="font-medium">Gesamt Module: {totalModules}</p>
        <p className="text-sm text-gray-600">
          Gesamtleistung: {totalPower.toLocaleString()} Wp
        </p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-bold mb-2">Details pro Dach:</h3>
        <div className="space-y-2">
          {roofStats.map((stat, index) => (
            <div key={stat.id} className="text-sm">
              <p className="font-medium">Dach {index + 1}:</p>
              <p className="text-gray-600">{stat.moduleCount} Module ({stat.power.toLocaleString()} Wp)</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};