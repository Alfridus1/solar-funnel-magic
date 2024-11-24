import { Card } from "@/components/ui/card";

export const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Einstellungen</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Keine Einstellungen</h3>
          <p className="text-muted-foreground">
            Aktuell sind keine Einstellungen verfügbar.
          </p>
        </Card>
      </div>
    </div>
  );
};