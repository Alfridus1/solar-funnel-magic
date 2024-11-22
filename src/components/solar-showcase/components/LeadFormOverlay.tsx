import { LeadForm } from "@/components/LeadForm";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadFormOverlayProps {
  formType: "quote" | "consultation" | null;
  metrics?: any;
  address?: string;
  onClose?: () => void;
}

export const LeadFormOverlay = ({ formType, metrics, address, onClose }: LeadFormOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="relative max-w-2xl w-full p-8 bg-white/95 max-h-[90vh] overflow-y-auto">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {formType === "quote"
            ? "Ihren persönlichen Solar-Report kostenlos anfordern"
            : "Beratungstermin vereinbaren"}
        </h2>
        <LeadForm 
          formType={formType} 
          metrics={metrics} 
          address={address}
          onSuccess={onClose}
        />
      </Card>
    </div>
  );
};