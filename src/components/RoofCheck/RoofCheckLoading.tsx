import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const RoofCheckLoading = () => (
  <Card className="max-w-5xl mx-auto p-6">
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-solar-orange" />
      <div className="text-gray-600">Karte wird geladen...</div>
    </div>
  </Card>
);