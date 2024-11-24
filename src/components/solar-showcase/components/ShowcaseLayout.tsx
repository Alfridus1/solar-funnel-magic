import { ReactNode } from "react";
import { ShowcaseSidebar } from "./ShowcaseSidebar";

interface ShowcaseLayoutProps {
  children: ReactNode;
}

export const ShowcaseLayout = ({ children }: ShowcaseLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-solar-blue-50 to-white">
      <ShowcaseSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};