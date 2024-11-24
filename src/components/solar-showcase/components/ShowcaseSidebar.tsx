import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  Menu
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const menuItems = [
  { 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    value: "dashboard" 
  },
  { 
    label: "Meine Anfragen", 
    icon: Inbox, 
    value: "requests" 
  },
  { 
    label: "Meine Projekte", 
    icon: LayoutGrid, 
    value: "projects" 
  },
  { 
    label: "Empfehlungsprogramm", 
    icon: Award, 
    value: "referral" 
  },
  { 
    label: "Dokumente", 
    icon: FileText, 
    value: "documents" 
  },
  { 
    label: "Einstellungen", 
    icon: Settings, 
    value: "settings" 
  },
];

export const ShowcaseSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Menu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-white hover:bg-gray-50">
              <Menu className="h-6 w-6 text-black" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full bg-white dark:bg-gray-800">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Dashboard
                </h2>
              </div>
              <nav className="space-y-1 px-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.value}
                      to={`#${item.value}`}
                      className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => {}}
                  className="flex w-full items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Ausloggen</span>
                </button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-screen">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-6 top-6 h-8 w-8 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-black" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-black" />
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

        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.value}
                to={`#${item.value}`}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className={cn(
                  "transition-all duration-300",
                  isCollapsed && "hidden"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          <button
            onClick={() => {}}
            className="flex w-full items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className={cn(
              "transition-all duration-300",
              isCollapsed && "hidden"
            )}>
              Ausloggen
            </span>
          </button>
        </nav>
      </div>
    </>
  );
};