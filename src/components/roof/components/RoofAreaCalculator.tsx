import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Ruler, Home, Sun } from "lucide-react";

interface RoofAreaCalculatorProps {
  polygon: google.maps.Polygon | null;
}

export const RoofAreaCalculator = ({ polygon }: RoofAreaCalculatorProps) => {
  const [area, setArea] = useState(0);
  const [solarPotential, setSolarPotential] = useState(0);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (polygon) {
      const path = polygon.getPath();
      const calculatedArea = google.maps.geometry.spherical.computeArea(path);
      const areaInSquareMeters = calculatedArea;
      setArea(Math.round(areaInSquareMeters * 100) / 100);
      
      // Calculate solar potential (simplified estimation)
      const estimatedPotential = (areaInSquareMeters * 0.15); // 15% efficiency
      setSolarPotential(Math.round(estimatedPotential * 100) / 100);

      // Generate chart data
      const newChartData = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(2024, i).toLocaleString('de-DE', { month: 'short' }),
        value: estimatedPotential * (0.7 + Math.sin(i / 12 * Math.PI) * 0.3) // Seasonal variation
      }));
      setChartData(newChartData);
    }
  }, [polygon]);

  if (!polygon) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-solar-blue-50 to-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-solar-blue-100 rounded-lg">
              <Ruler className="h-6 w-6 text-solar-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Dachfläche</p>
              <p className="text-2xl font-bold">{area.toLocaleString('de-DE')} m²</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-solar-orange-50 to-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-solar-orange-100 rounded-lg">
              <Sun className="h-6 w-6 text-solar-orange-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Solar-Potenzial</p>
              <p className="text-2xl font-bold">{solarPotential.toLocaleString('de-DE')} kWp</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Home className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Jahresertrag</p>
              <p className="text-2xl font-bold">{Math.round(solarPotential * 1000).toLocaleString('de-DE')} kWh</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Geschätzter Jahresverlauf</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F75C03" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#F75C03" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${Math.round(value)} kWh`, 'Ertrag']}
                labelFormatter={(label) => `Monat: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#F75C03"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};