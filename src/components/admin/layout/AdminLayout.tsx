import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Fehler beim Abmelden",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Erfolgreich abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white flex justify-end">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Abmelden
          </Button>
        </div>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};