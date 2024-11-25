import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Home,
  FileText,
  Users,
  Calendar,
  Clock,
  Settings,
  LogOut,
  Building2,
  ShieldCheck,
  Briefcase,
  FileBox,
  UserCircle,
  Award,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface UnifiedSidebarProps {
  userRoles?: {
    isAdmin: boolean;
    isEmployee: boolean;
  };
}

export const UnifiedSidebar = ({ userRoles }: UnifiedSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(['customer']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

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
    navigate("/login");
  };

  const customerMenuItems = [
    { 
      label: "Dashboard", 
      icon: Home, 
      path: "/dashboard/customer#dashboard"
    },
    { 
      label: "Meine Anfragen", 
      icon: FileText, 
      path: "/dashboard/customer#requests"
    },
    { 
      label: "Meine Projekte", 
      icon: Briefcase, 
      path: "/dashboard/customer#projects"
    },
    { 
      label: "Empfehlungsprogramm", 
      icon: Award, 
      path: "/dashboard/customer#referral"
    },
    { 
      label: "Dokumente", 
      icon: FileBox, 
      path: "/dashboard/customer#documents"
    },
    { 
      label: "Profil", 
      icon: UserCircle, 
      path: "/dashboard/customer#profile"
    },
    { 
      label: "Einstellungen", 
      icon: Settings, 
      path: "/dashboard/customer#settings"
    },
  ];

  const employeeMenuItems = [
    { 
      label: "Übersicht", 
      icon: Home, 
      path: "/dashboard/employee#overview"
    },
    { 
      label: "Aufgaben", 
      icon: FileText, 
      path: "/dashboard/employee#tasks"
    },
    { 
      label: "Team", 
      icon: Users, 
      path: "/dashboard/employee#team"
    },
    { 
      label: "Kalender", 
      icon: Calendar, 
      path: "/dashboard/employee#calendar"
    },
    { 
      label: "Zeiterfassung", 
      icon: Clock, 
      path: "/dashboard/employee#time"
    },
    { 
      label: "Einstellungen", 
      icon: Settings, 
      path: "/dashboard/employee#settings"
    },
  ];

  const adminMenuItems = [
    { 
      label: "Übersicht", 
      icon: Home, 
      path: "/dashboard/admin#overview"
    },
    { 
      label: "Leads", 
      icon: FileText, 
      path: "/dashboard/admin#leads"
    },
    { 
      label: "Benutzer", 
      icon: Users, 
      path: "/dashboard/admin#users"
    },
    { 
      label: "Partner", 
      icon: Award, 
      path: "/dashboard/admin#affiliates"
    },
    { 
      label: "Mitarbeiter", 
      icon: Users, 
      path: "/dashboard/admin#employees"
    },
    { 
      label: "Produkte", 
      icon: Package, 
      path: "/dashboard/admin#products"
    },
    { 
      label: "Aufgabentypen", 
      icon: FileText, 
      path: "/dashboard/admin#task-types"
    },
    { 
      label: "Premium Produkte", 
      icon: Award, 
      path: "/dashboard/admin#premium"
    },
    { 
      label: "Administratoren", 
      icon: ShieldCheck, 
      path: "/dashboard/admin#admins"
    },
    { 
      label: "Einstellungen", 
      icon: Settings, 
      path: "/dashboard/admin#settings"
    },
  ];

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
          {isCollapsed ? "DB" : "Dashboard"}
        </h2>
      </div>

      <nav className="space-y-1 px-3">
        {/* Customer Section */}
        <Collapsible
          open={openSections.includes('customer')}
          onOpenChange={() => !isCollapsed && toggleSection('customer')}
        >
          <CollapsibleTrigger className="flex items-center w-full px-3 py-2 text-left">
            <Building2 className="h-5 w-5 mr-3" />
            {!isCollapsed && (
              <>
                <span className="flex-1">Kundenbereich</span>
                {openSections.includes('customer') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            {!isCollapsed && customerMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-6",
                    location.pathname + location.hash === item.path
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Employee Section */}
        {userRoles?.isEmployee && (
          <Collapsible
            open={openSections.includes('employee')}
            onOpenChange={() => !isCollapsed && toggleSection('employee')}
          >
            <CollapsibleTrigger className="flex items-center w-full px-3 py-2 text-left">
              <Users className="h-5 w-5 mr-3" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">Mitarbeiterbereich</span>
                  {openSections.includes('employee') ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              {!isCollapsed && employeeMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-6",
                      location.pathname + location.hash === item.path
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Admin Section */}
        {userRoles?.isAdmin && (
          <Collapsible
            open={openSections.includes('admin')}
            onOpenChange={() => !isCollapsed && toggleSection('admin')}
          >
            <CollapsibleTrigger className="flex items-center w-full px-3 py-2 text-left">
              <ShieldCheck className="h-5 w-5 mr-3" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">Administrationsbereich</span>
                  {openSections.includes('admin') ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              {!isCollapsed && adminMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-6",
                      location.pathname + location.hash === item.path
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-4"
        >
          <LogOut className="h-5 w-5 mr-3" />
          {!isCollapsed && <span>Ausloggen</span>}
        </button>
      </nav>
    </div>
  );
};