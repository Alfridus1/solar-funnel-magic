import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const menuItems = [
  { 
    label: "Zurück zur Startseite", 
    icon: ArrowLeft, 
    path: "/" 
  },
  { 
    label: "Zum Dashboard", 
    icon: LayoutDashboard, 
    path: "/dashboard" 
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
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full bg-white dark:bg-gray-800">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Solar-Konfigurator
                </h2>
              </div>
              <nav className="space-y-1 px-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
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
            {isCollapsed ? "Menu" : "Solar-Konfigurator"}
          </h2>
        </div>

        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
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
        </nav>
      </div>
    </>
  );
};