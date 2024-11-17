import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ConsumptionInput } from "@/components/configurator/ConsumptionInput";
import { Card, CardContent } from "@/components/ui/card";

export const ConsumptionPage = () => {
  const [yearlyConsumption, setYearlyConsumption] = useState(4000);
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(`/configurator/modules?consumption=${yearlyConsumption}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Ihr jährlicher Stromverbrauch
      </h1>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Energieverbrauch Visualisierung"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <ConsumptionInput
            yearlyConsumption={yearlyConsumption}
            onChange={setYearlyConsumption}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Weiter zur Modulauswahl
        </Button>
      </div>
    </div>
  );
};