import { ReactNode } from "react";
import { UnifiedSidebar } from "./UnifiedSidebar";

interface UnifiedLayoutProps {
  children: ReactNode;
}

export const UnifiedLayout = ({ children }: UnifiedLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar>
        <nav className="space-y-1">
          {/* Default navigation items */}
          <div className="px-3 py-2">Navigation</div>
        </nav>
      </UnifiedSidebar>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};