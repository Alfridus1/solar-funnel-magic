import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  Inbox,
  LayoutGrid,
  Award,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CustomerSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Meine Anfragen", icon: Inbox, path: "/dashboard#requests" },
  { label: "Meine Projekte", icon: LayoutGrid, path: "/dashboard#projects" },
  { label: "Empfehlungsprogramm", icon: Award, path: "/dashboard#referral" },
  { label: "Dokumente", icon: FileText, path: "/dashboard#documents" },
  { label: "Einstellungen", icon: Settings, path: "/dashboard#settings" }
];

export const CustomerSidebar = ({ isCollapsed, onToggle, isMobile, onClose }: CustomerSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
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
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg">
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="self-end m-2"
          onClick={onToggle}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      )}

      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname + location.hash === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-solar-orange text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center px-3 py-2 mx-2 mb-4 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
      >
        <LogOut className="h-5 w-5 mr-3" />
        {!isCollapsed && <span>Ausloggen</span>}
      </button>
    </div>
  );
};