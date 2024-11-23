import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Willkommen in Ihrem Dashboard</p>
        </CardContent>
      </Card>
    </div>
  );
};