import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { CustomerSidebar } from "@/components/dashboard/layout/CustomerSidebar";

interface SharedLayoutProps {
  children: ReactNode;
}

export const SharedLayout = ({ children }: SharedLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className={`hidden md:block transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <CustomerSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-16">
          <CustomerSidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};