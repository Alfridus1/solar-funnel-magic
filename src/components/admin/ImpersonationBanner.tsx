import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ImpersonationBannerProps {
  userEmail: string;
  onExit: () => void;
}

export const ImpersonationBanner = ({ userEmail, onExit }: ImpersonationBannerProps) => {
  const { toast } = useToast();

  const handleExit = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Fehler beim Beenden der Impersonation",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    onExit();
  };

  return (
    <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 flex justify-between items-center">
      <p className="text-yellow-800">
        Sie sind eingeloggt als: <strong>{userEmail}</strong>
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExit}
        className="text-yellow-800 hover:text-yellow-900"
      >
        <X className="h-4 w-4 mr-2" />
        Beenden
      </Button>
    </div>
  );
};