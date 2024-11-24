import { ReactNode } from "react";
import { SharedLayout } from "@/components/layout/SharedLayout";

interface ShowcaseLayoutProps {
  children: ReactNode;
}

export const ShowcaseLayout = ({ children }: ShowcaseLayoutProps) => {
  return (
    <SharedLayout>
      {children}
    </SharedLayout>
  );
};