import { Card } from "@/components/ui/card";

export const TimeTracking = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Zeiterfassung</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Keine Zeiterfassung</h3>
          <p className="text-muted-foreground">
            Keine Zeiterfassungen vorhanden.
          </p>
        </Card>
      </div>
    </div>
  );
};