import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Users, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const UnifiedSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname + location.hash;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRoles, setUserRoles] = useState({
    isAdmin: false,
    isEmployee: false
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserRoles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const { data: employee } = await supabase
        .from('employees')
        .select('role')
        .eq('profile_id', user.id)
        .single();

      setUserRoles({
        isAdmin: profile?.role === 'admin',
        isEmployee: !!employee || profile?.role === 'admin' // Admin is also an employee
      });
    };

    loadUserRoles();
  }, [navigate]);

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
    navigate("/");
  };

  return (
    <div className={cn(
      "relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-screen",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="p-6">
        <h2 className={cn(
          "text-2xl font-bold text-gray-800 dark:text-white transition-all duration-300",
          isCollapsed && "text-center text-xl"
        )}>
          {isCollapsed ? "D" : "Dashboard"}
        </h2>
      </div>

      <div className="space-y-2 px-3">
        {/* Kundenbereich */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center w-full px-3 py-2 text-left">
            <Building2 className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>Kundenbereich</span>}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-8 space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                Übersicht
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Meine Projekte
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Dokumente
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Mitarbeiterbereich */}
        {userRoles.isEmployee && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center w-full px-3 py-2 text-left">
              <Users className="h-5 w-5 mr-3" />
              {!isCollapsed && <span>Mitarbeiterbereich</span>}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-8 space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  Aufgaben
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Kalender
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Team
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Administrationsbereich */}
        {userRoles.isAdmin && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center w-full px-3 py-2 text-left">
              <ShieldCheck className="h-5 w-5 mr-3" />
              {!isCollapsed && <span>Administration</span>}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-8 space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  Benutzer
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Einstellungen
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Statistiken
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};