import { Card } from "@/components/ui/card";

export function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Mein Profil</h1>
        <p>Hier können Sie Ihre Profileinstellungen verwalten.</p>
      </Card>
    </div>
  );
}