import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Profile, AffiliateInfo } from "./types/userManagement";

interface UserDetailsDialogProps {
  user: Profile | null;
  affiliateInfo: AffiliateInfo | null;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsDialog = ({ user, affiliateInfo, onOpenChange }: UserDetailsDialogProps) => {
  const { toast } = useToast();

  const copyAffiliateLink = () => {
    if (!affiliateInfo?.referral_code) return;
    
    const baseUrl = window.location.origin;
    const affiliateLink = `${baseUrl}/?ref=${affiliateInfo.referral_code}`;
    
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link kopiert!",
      description: "Der Affiliate-Link wurde in die Zwischenablage kopiert.",
    });
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Benutzerdetails</DialogTitle>
        </DialogHeader>
        
        {user && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{`${user.first_name} ${user.last_name}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registriert am</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('de-DE')}
                </p>
              </div>
            </div>

            <Card className="p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">Affiliate Informationen</h3>
              {affiliateInfo?.referral_code ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Referral Code</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {affiliateInfo.referral_code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAffiliateLink}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Link kopieren
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Vermittlungen</p>
                      <p className="font-medium">{affiliateInfo.referral_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Leads</p>
                      <p className="font-medium">{affiliateInfo.total_leads || 0}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Kein Affiliate-Konto</p>
              )}
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};