import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SystemConfig } from "@/components/configurator/types";

export function Configurator() {
  const [config, setConfig] = useState<SystemConfig>({
    modules: [],
    inverter: null,
    battery: null
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Solaranlage konfigurieren</h1>
        <p>Konfigurieren Sie hier Ihre Solaranlage nach Ihren Wünschen.</p>
      </Card>
    </div>
  );
}