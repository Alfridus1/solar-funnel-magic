import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ReferralOverview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Empfehlungsprogramm</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ihr Empfehlungsprogramm</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Empfehlen Sie uns weiter und profitieren Sie</p>
        </CardContent>
      </Card>
    </div>
  );
};