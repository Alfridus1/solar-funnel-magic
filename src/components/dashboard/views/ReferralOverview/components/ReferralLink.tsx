import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

interface ReferralLinkProps {
  referralCode: string;
}

export const ReferralLink = ({ referralCode }: ReferralLinkProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const referralLink = `https://coppen.app/?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link kopiert!",
      description: "Der Empfehlungslink wurde in die Zwischenablage kopiert.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Ihr persönlicher Empfehlungslink</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-gray-50 p-3 rounded-lg break-all">
          <p className="text-sm">{referralLink}</p>
        </div>
        <Button
          onClick={handleCopyLink}
          className="shrink-0"
        >
          <Copy className="h-4 w-4 mr-2" />
          {copied ? "Kopiert!" : "Link kopieren"}
        </Button>
      </div>
      <p className="text-sm text-gray-600 mt-4">
        Teilen Sie diesen Link mit Ihren Kontakten. Für jede erfolgreiche Empfehlung und jeden Verkauf erhalten Sie eine Provision.
      </p>
    </Card>
  );
};