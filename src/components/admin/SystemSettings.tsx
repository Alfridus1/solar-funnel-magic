import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const SystemSettings = () => {
  const [settings, setSettings] = useState({
    yieldFactor: 1000,
    defaultConsumption: 4000,
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings storage
    toast({
      title: "Einstellungen gespeichert",
      description: "Die Systemeinstellungen wurden aktualisiert.",
    });
  };

  return (
    <Card className="p-6 max-w-xl">
      <h2 className="text-2xl font-semibold mb-6">Systemeinstellungen</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="yieldFactor">Ertragsfaktor (kWh/kWp)</Label>
          <Input
            id="yieldFactor"
            type="number"
            value={settings.yieldFactor}
            onChange={(e) => setSettings({ ...settings, yieldFactor: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="defaultConsumption">Standard Jahresverbrauch (kWh)</Label>
          <Input
            id="defaultConsumption"
            type="number"
            value={settings.defaultConsumption}
            onChange={(e) => setSettings({ ...settings, defaultConsumption: Number(e.target.value) })}
          />
        </div>

        <Button type="submit">Einstellungen speichern</Button>
      </form>
    </Card>
  );
};