import { Card } from "@/components/ui/card";

export function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Willkommen im Administrationsbereich.</p>
      </Card>
    </div>
  );
}