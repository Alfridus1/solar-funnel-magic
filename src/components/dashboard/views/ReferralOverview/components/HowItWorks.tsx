import { Card } from "@/components/ui/card";

export const HowItWorks = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">So funktioniert's</h2>
      <div className="grid gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            1
          </div>
          <div>
            <p className="font-medium">Teilen Sie Ihren Link</p>
            <p className="text-sm text-gray-600">
              Senden Sie Ihren persönlichen Empfehlungslink an Interessenten
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            2
          </div>
          <div>
            <p className="font-medium">Registrierung & Kauf</p>
            <p className="text-sm text-gray-600">
              Wenn sich jemand über Ihren Link registriert und ein System kauft, wird dies automatisch erfasst
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            3
          </div>
          <div>
            <p className="font-medium">Provision</p>
            <p className="text-sm text-gray-600">
              Sie erhalten eine Provision für die Registrierung und einen Prozentsatz des Verkaufswertes
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};