import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "@/pages/Login";
import { UnifiedDashboard } from "@/components/dashboard/UnifiedDashboard";
import { Toaster } from "@/components/ui/toaster";
import { Index } from "@/pages/Index";
import { AffiliateLanding } from "@/pages/AffiliateLanding";
import { ProductShowcase } from "@/components/solar-showcase/ProductShowcase";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserManagement } from "@/components/admin/UserManagement";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <UnifiedDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/solar-showcase" element={<ProductShowcase />} />
        <Route path="/affiliate" element={<AffiliateLanding />} />
        <Route 
          path="/recommended-config" 
          element={<Navigate to="/solar-showcase" replace />} 
        />
      </Routes>
      <Toaster />
    </>
  );
}