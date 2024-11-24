import { Card } from "@/components/ui/card";

export const Tasks = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Aufträge</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Keine Aufträge</h3>
          <p className="text-muted-foreground">
            Aktuell sind keine Aufträge zugewiesen.
          </p>
        </Card>
      </div>
    </div>
  );
};