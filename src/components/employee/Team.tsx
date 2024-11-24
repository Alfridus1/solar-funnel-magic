import { Card } from "@/components/ui/card";

export const Team = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mein Team</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Keine Teammitglieder</h3>
          <p className="text-muted-foreground">
            Aktuell sind keine Teammitglieder zugewiesen.
          </p>
        </Card>
      </div>
    </div>
  );
};