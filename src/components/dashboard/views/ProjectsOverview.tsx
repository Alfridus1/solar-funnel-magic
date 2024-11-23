import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProjectsOverview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Projekte</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ihre Projekte</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Hier sehen Sie Ihre Projekte</p>
        </CardContent>
      </Card>
    </div>
  );
};