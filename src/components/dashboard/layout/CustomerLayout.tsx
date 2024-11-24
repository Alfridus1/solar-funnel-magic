import { ReactNode } from "react";
import { SharedLayout } from "@/components/layout/SharedLayout";

interface CustomerLayoutProps {
  children: ReactNode;
}

export const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  return (
    <SharedLayout>
      {children}
    </SharedLayout>
  );
};