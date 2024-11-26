import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  onShowLogin: () => void;
  onShowRegister: () => void;
  userRole?: string | null;
}

export const Header = ({ isLoggedIn, onShowLogin, onShowRegister, userRole }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Fehler beim Ausloggen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Erfolgreich ausgeloggt",
      description: "Sie wurden erfolgreich ausgeloggt.",
    });
  };

  const handleDashboardNavigation = () => {
    switch (userRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'employee':
        navigate('/employee/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="fixed top-0 right-0 p-4 md:p-6 z-50 w-full flex justify-end">
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white/90 backdrop-blur hover:bg-white shadow-sm"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleDashboardNavigation}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Ausloggen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2 sm:gap-4">
          <Button 
            variant="outline"
            onClick={onShowLogin}
            className="bg-white/90 backdrop-blur hover:bg-white shadow-sm text-sm sm:text-base px-3 sm:px-4"
          >
            Login
          </Button>
          <Button
            onClick={onShowRegister}
            className="bg-solar-orange hover:bg-solar-orange/90 text-white shadow-sm text-sm sm:text-base px-3 sm:px-4"
          >
            Registrieren
          </Button>
        </div>
      )}
    </div>
  );
};