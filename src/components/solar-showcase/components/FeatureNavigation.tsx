import { Button } from "@/components/ui/button";
import { Sun, Battery, Zap, Thermometer } from "lucide-react";

interface FeatureNavigationProps {
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
}

export const FeatureNavigation = ({ activeFeature, onFeatureSelect }: FeatureNavigationProps) => {
  const features = [
    { id: "solar", icon: Sun, label: "Solarmodule", color: "bg-yellow-500" },
    { id: "inverter", icon: Zap, label: "Wechselrichter", color: "bg-blue-500" },
    { id: "battery", icon: Battery, label: "Speicher", color: "bg-green-500" },
    { id: "heatpump", icon: Thermometer, label: "Wärmepumpe", color: "bg-red-500" },
  ];

  return (
    <div className="flex lg:flex-col gap-4">
      {features.map((feature) => (
        <div key={feature.id} className="relative group">
          <Button
            variant={activeFeature === feature.id ? "default" : "outline"}
            onClick={() => onFeatureSelect(feature.id)}
            className={`w-16 h-16 rounded-full p-0 transition-all duration-300 ${
              activeFeature === feature.id ? `${feature.color} hover:opacity-90` : ""
            }`}
          >
            <feature.icon className="h-8 w-8" />
          </Button>
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden lg:block">
            {feature.label}
          </span>
        </div>
      ))}
    </div>
  );
};