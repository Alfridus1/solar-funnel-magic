import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  isLoggedIn: boolean;
  userRole: string | null;
  onShowLogin: () => void;
  onShowRegister: () => void;
  handleDashboardNavigation: () => void;
}

export const Header = ({ 
  isLoggedIn, 
  userRole, 
  onShowLogin, 
  onShowRegister,
  handleDashboardNavigation 
}: HeaderProps) => {
  const { toast } = useToast();

  return (
    <div className="fixed top-0 right-0 p-4 z-50 w-full flex justify-end">
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-white/90 backdrop-blur hover:bg-white">
              <User className="h-4 w-4" />
              Profil
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleDashboardNavigation}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              await supabase.auth.signOut();
              toast({
                title: "Erfolgreich ausgeloggt",
                description: "Auf Wiedersehen!",
              });
            }}>
              Ausloggen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={onShowLogin}
            className="bg-white/90 backdrop-blur hover:bg-white"
          >
            Login
          </Button>
          <Button 
            variant="default"
            onClick={onShowRegister}
            className="bg-solar-orange hover:bg-solar-orange/90 text-white"
          >
            Registrieren
          </Button>
        </div>
      )}
    </div>
  );
};