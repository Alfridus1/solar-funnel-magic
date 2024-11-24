import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "@/pages/Login";
import { EmployeeLogin } from "@/pages/EmployeeLogin";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { RecommendedConfig } from "@/pages/RecommendedConfig";
import { Toaster } from "@/components/ui/toaster";
import { Index } from "@/pages/Index";
import { AffiliateLanding } from "@/pages/AffiliateLanding";
import { ProductShowcase } from "@/components/solar-showcase/ProductShowcase";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/dashboard/*" element={<CustomerDashboard />} />
        <Route path="/recommended-config" element={<RecommendedConfig />} />
        <Route 
          path="/solar-showcase" 
          element={
            <ProtectedRoute>
              <ProductShowcase />
            </ProtectedRoute>
          } 
        />
        <Route path="/affiliate" element={<AffiliateLanding />} />
      </Routes>
      <Toaster />
    </>
  );
}