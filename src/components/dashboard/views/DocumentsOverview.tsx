import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DocumentsOverview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dokumente</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ihre Dokumente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Noch keine Dokumente vorhanden</p>
        </CardContent>
      </Card>
    </div>
  );
};