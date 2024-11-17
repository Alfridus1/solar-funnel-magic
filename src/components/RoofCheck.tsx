import { useState, useEffect } from "react";
import { Loader2, Sun, Home, Battery } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SolarEstimate {
  monthlyProduction: number; // kWh
  annualSavings: number; // dollars
  co2Reduction: number; // tons per year
  roofCoverage: number; // percentage
}

const mockMonthlyData = [
  { name: "Jan", production: 400 },
  { name: "Feb", production: 500 },
  { name: "Mar", production: 650 },
  { name: "Apr", production: 800 },
  { name: "May", production: 950 },
  { name: "Jun", production: 1000 },
  { name: "Jul", production: 1050 },
  { name: "Aug", production: 950 },
  { name: "Sep", production: 800 },
  { name: "Oct", production: 600 },
  { name: "Nov", production: 450 },
  { name: "Dec", production: 380 },
];

export const RoofCheck = () => {
  const [analyzing, setAnalyzing] = useState(true);
  const [estimate, setEstimate] = useState<SolarEstimate | null>(null);

  useEffect(() => {
    // Simulate API call to analyze roof and calculate solar potential
    const timer = setTimeout(() => {
      setAnalyzing(false);
      setEstimate({
        monthlyProduction: 850, // Average kWh per month
        annualSavings: 2400, // Dollars per year
        co2Reduction: 6.2, // Tons of CO2 per year
        roofCoverage: 65, // Percentage of suitable roof area
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (analyzing) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-6 bg-white animate-fade-up">
        <CardContent className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Analyzing your roof...</h3>
          <p className="text-gray-600">
            Our AI is calculating your solar potential using:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            <li>• Satellite imagery analysis</li>
            <li>• Local weather patterns</li>
            <li>• Roof orientation and shade</li>
            <li>• Historical sunlight data</li>
          </ul>
        </CardContent>
      </Card>
    );
  }

  if (!estimate) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-up">
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-4">
              <Sun className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Monthly Production</p>
                <p className="text-xl font-bold">
                  {estimate.monthlyProduction} kWh
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Battery className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Annual Savings</p>
                <p className="text-xl font-bold">${estimate.annualSavings}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Home className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Roof Coverage</p>
                <p className="text-xl font-bold">{estimate.roofCoverage}%</p>
              </div>
            </div>
          </div>

          <div className="h-[300px] mt-6">
            <h4 className="text-sm font-medium mb-4">
              Estimated Monthly Production (kWh)
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="production"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              By going solar, you could reduce your CO2 emissions by{" "}
              <span className="font-bold">{estimate.co2Reduction} tons</span> per
              year!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};