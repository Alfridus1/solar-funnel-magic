import { LeadForm } from "@/components/LeadForm";
import { Card } from "@/components/ui/card";

interface LeadFormOverlayProps {
  formType: "quote" | "consultation" | null;
}

export const LeadFormOverlay = ({ formType }: LeadFormOverlayProps) => {
  return (
    <div className="absolute inset-x-0 top-0 z-20 backdrop-blur-sm bg-white/30 p-8">
      <Card className="max-w-2xl mx-auto p-8 bg-white/95">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {formType === "quote"
            ? "Ihren persönlichen Solar-Report kostenlos anfordern"
            : "Beratungstermin vereinbaren"}
        </h2>
        <LeadForm formType={formType} />
      </Card>
    </div>
  );
};