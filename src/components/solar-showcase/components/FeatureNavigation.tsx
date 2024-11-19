import { Button } from "@/components/ui/button";
import { Sun, Battery, Zap, Thermometer } from "lucide-react";

interface FeatureNavigationProps {
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
}

export const FeatureNavigation = ({ activeFeature, onFeatureSelect }: FeatureNavigationProps) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 space-y-4 z-50">
      <Button
        variant={activeFeature === "solar" ? "default" : "outline"}
        onClick={() => onFeatureSelect("solar")}
        className={`w-16 h-16 rounded-full p-0 ${
          activeFeature === "solar" ? "bg-yellow-500 hover:bg-yellow-600" : ""
        }`}
      >
        <Sun className="h-8 w-8" />
      </Button>
      
      <Button
        variant={activeFeature === "inverter" ? "default" : "outline"}
        onClick={() => onFeatureSelect("inverter")}
        className={`w-16 h-16 rounded-full p-0 ${
          activeFeature === "inverter" ? "bg-blue-500 hover:bg-blue-600" : ""
        }`}
      >
        <Zap className="h-8 w-8" />
      </Button>
      
      <Button
        variant={activeFeature === "battery" ? "default" : "outline"}
        onClick={() => onFeatureSelect("battery")}
        className={`w-16 h-16 rounded-full p-0 ${
          activeFeature === "battery" ? "bg-green-500 hover:bg-green-600" : ""
        }`}
      >
        <Battery className="h-8 w-8" />
      </Button>
      
      <Button
        variant={activeFeature === "heatpump" ? "default" : "outline"}
        onClick={() => onFeatureSelect("heatpump")}
        className={`w-16 h-16 rounded-full p-0 ${
          activeFeature === "heatpump" ? "bg-red-500 hover:bg-red-600" : ""
        }`}
      >
        <Thermometer className="h-8 w-8" />
      </Button>
    </div>
  );
};