import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Ruler, Home, Sun, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface RoofAreaCalculatorProps {
  polygons: google.maps.Polygon[];
}

// Durchschnittliche Sonnenstunden pro Monat in Deutschland
const MONTHLY_SUN_HOURS = {
  Jan: 44,
  Feb: 73,
  Mar: 120,
  Apr: 175,
  Mai: 230,
  Jun: 240,
  Jul: 235,
  Aug: 210,
  Sep: 160,
  Okt: 108,
  Nov: 51,
  Dez: 37
};

export const RoofAreaCalculator = ({ polygons }: RoofAreaCalculatorProps) => {
  const [totalArea, setTotalArea] = useState(0);
  const [solarPotential, setSolarPotential] = useState(0);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (polygons.length > 0) {
      let calculatedTotalArea = 0;
      
      polygons.forEach(polygon => {
        const path = polygon.getPath();
        const area = google.maps.geometry.spherical.computeArea(path);
        calculatedTotalArea += area;
      });

      const areaInSquareMeters = calculatedTotalArea;
      setTotalArea(Math.round(areaInSquareMeters * 100) / 100);
      
      // Berechne Solar-Potenzial (15% Effizienz)
      const estimatedPotential = (areaInSquareMeters * 0.15);
      setSolarPotential(Math.round(estimatedPotential * 100) / 100);

      // Generiere Chartdaten basierend auf den tatsächlichen Sonnenstunden
      const maxSunHours = Math.max(...Object.values(MONTHLY_SUN_HOURS));
      const newChartData = Object.entries(MONTHLY_SUN_HOURS).map(([month, hours]) => ({
        name: month,
        value: (estimatedPotential * hours) / maxSunHours
      }));
      setChartData(newChartData);
    }
  }, [polygons]);

  const handleContinue = () => {
    navigate("/recommended-config", {
      state: {
        metrics: {
          roofArea: totalArea,
          kWp: solarPotential,
          monthlyProduction: Math.round((solarPotential * 1000) / 12),
          annualSavings: Math.round(solarPotential * 1000 * 0.40), // 0.40€ pro kWh
          possiblePanels: Math.floor(totalArea / 1.7), // 1.7m² pro Panel
          roofDetails: polygons.map((polygon, index) => ({
            roofId: `roof-${index + 1}`,
            moduleCount: Math.floor(google.maps.geometry.spherical.computeArea(polygon.getPath()) / 1.7)
          }))
        }
      }
    });
  };

  if (polygons.length === 0) return null;

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
              <p className="text-sm text-gray-600">Gesamte Dachfläche</p>
              <p className="text-2xl font-bold">{totalArea.toLocaleString('de-DE')} m²</p>
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Geschätzter Jahresverlauf</h3>
          <Button 
            onClick={handleContinue}
            className="bg-solar-orange hover:bg-solar-orange-600"
          >
            Jetzt Ihre Einsparungen erfahren
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
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