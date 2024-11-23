import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RequestsOverview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Anfragen</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ihre Anfragen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Hier sehen Sie Ihre Anfragen</p>
        </CardContent>
      </Card>
    </div>
  );
};