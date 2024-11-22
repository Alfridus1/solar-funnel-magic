import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SettingsOverview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Einstellungen</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ihre Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Einstellungen werden hier angezeigt</p>
        </CardContent>
      </Card>
    </div>
  );
};