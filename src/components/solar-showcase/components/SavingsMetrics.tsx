import { Card } from "@/components/ui/card";
import { Euro, Battery, TrendingUp, Home } from "lucide-react";

interface SavingsMetricsProps {
  monthlySavings: number;
  yearlySavings: number;
  roiYears: number;
  initialYearlySavings: number;
}

export const SavingsMetrics = ({ monthlySavings, yearlySavings, roiYears, initialYearlySavings }: SavingsMetricsProps) => {
  // Calculate 30-year savings with 5.5% annual increase
  const calculate30YearSavings = (initialYearlySavings: number) => {
    let totalSavings = 0;
    let currentYearSavings = initialYearlySavings;
    
    for (let year = 0; year < 30; year++) {
      totalSavings += currentYearSavings;
      currentYearSavings *= 1.055; // 5.5% increase per year
    }
    
    return Math.round(totalSavings);
  };

  const thirtyYearSavings = calculate30YearSavings(initialYearlySavings);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-white transition-all hover:shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Euro className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-gray-600 font-medium">Monatliche Ersparnis</span>
        </div>
        <span className="text-3xl font-bold text-blue-600">{monthlySavings}€</span>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-white transition-all hover:shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-green-100 rounded-xl">
            <Battery className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-gray-600 font-medium">Jährliche Ersparnis</span>
        </div>
        <span className="text-3xl font-bold text-green-600">{yearlySavings}€</span>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-orange-50 to-white transition-all hover:shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <span className="text-gray-600 font-medium">Amortisationszeit</span>
        </div>
        <span className="text-3xl font-bold text-orange-600">{roiYears} Jahre</span>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-white transition-all hover:shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Home className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-gray-600 font-medium">30 Jahre Ersparnis</span>
          <span className="text-xs text-gray-500">(+5,5% p.a.)</span>
        </div>
        <span className="text-3xl font-bold text-purple-600">{thirtyYearSavings.toLocaleString()}€</span>
      </Card>
    </div>
  );
};