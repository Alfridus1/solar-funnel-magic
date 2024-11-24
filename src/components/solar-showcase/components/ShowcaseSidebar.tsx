import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { label: "Übersicht", value: "overview" },
  { label: "Technische Details", value: "technical" },
  { label: "Wirtschaftlichkeit", value: "economics" },
  { label: "Premium Produkte", value: "premium" },
  { label: "Referenzen", value: "references" },
  { label: "FAQ", value: "faq" }
];

export const ShowcaseSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className={cn(
      "relative bg-white/80 backdrop-blur border-r border-gray-200 transition-all duration-300 h-screen",
      isCollapsed ? "w-16" : "w-64"
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

      <div className="p-4">
        <h2 className={cn(
          "text-xl font-bold text-gray-800 transition-all duration-300",
          isCollapsed && "text-center text-base"
        )}>
          {isCollapsed ? "Menu" : "Navigation"}
        </h2>
      </div>

      <nav className="space-y-1 px-2">
        {menuItems.map((item) => (
          <button
            key={item.value}
            onClick={() => {
              const element = document.getElementById(item.value);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={cn(
              "flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span className={cn(
              "transition-all duration-300",
              isCollapsed && "hidden"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};