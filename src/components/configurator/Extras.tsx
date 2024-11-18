import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plug, Battery, HomeIcon } from "lucide-react";

interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
}

export const Extras = () => {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const extras: Extra[] = [
    {
      id: "wallbox",
      name: "Wallbox",
      description: "11kW Ladeleistung für Ihr E-Auto",
      price: 1299,
      icon: <Plug className="h-6 w-6" />,
    },
    {
      id: "battery",
      name: "Batteriespeicher",
      description: "10kWh Speicherkapazität",
      price: 8499,
      icon: <Battery className="h-6 w-6" />,
    },
    {
      id: "smartHome",
      name: "Smart Home Integration",
      description: "Intelligente Haussteuerung",
      price: 799,
      icon: <HomeIcon className="h-6 w-6" />,
    },
  ];

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Optionale Erweiterungen</h2>
      <div className="space-y-4">
        {extras.map((extra) => (
          <div
            key={extra.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                {extra.icon}
              </div>
              <div>
                <h3 className="font-semibold">{extra.name}</h3>
                <p className="text-sm text-gray-600">{extra.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">{extra.price}€</span>
              <Button
                variant={selectedExtras.includes(extra.id) ? "secondary" : "default"}
                onClick={() => toggleExtra(extra.id)}
                className={selectedExtras.includes(extra.id) ? "bg-blue-100" : ""}
              >
                {selectedExtras.includes(extra.id) ? "Ausgewählt" : "Hinzufügen"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};