import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Share2 } from "lucide-react";

interface ReferralLinkProps {
  referralCode?: string;
}

export const ReferralLink = ({ referralCode }: ReferralLinkProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const referralLink = referralCode 
    ? `${window.location.origin}/register?ref=${referralCode}`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Link kopiert!",
        description: "Der Empfehlungslink wurde in die Zwischenablage kopiert.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Fehler beim Kopieren",
        description: "Der Link konnte nicht kopiert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mein Empfehlungslink',
          text: 'Registrieren Sie sich mit meinem Empfehlungslink',
          url: referralLink,
        });
        toast({
          title: "Erfolgreich geteilt!",
          description: "Ihr Link wurde zum Teilen geöffnet.",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Fehler beim Teilen",
            description: "Der Link konnte nicht geteilt werden. Bitte versuchen Sie es erneut.",
            variant: "destructive",
          });
        }
      }
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Ihr persönlicher Empfehlungslink</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-gray-50 p-3 rounded-lg break-all">
          <p className="text-sm font-medium">{referralLink}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCopyLink}
            className="flex-1 sm:flex-none"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Kopiert!" : "Link kopieren"}
          </Button>
          {navigator.share && (
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Teilen
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-4">
        Teilen Sie diesen Link mit Ihren Kontakten. Für jede erfolgreiche Empfehlung und jeden Verkauf erhalten Sie eine Provision.
      </p>
    </Card>
  );
};