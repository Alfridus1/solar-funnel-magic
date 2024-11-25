import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { Login } from "@/pages/Login";
import { EmployeeLogin } from "@/pages/EmployeeLogin";
import { Index } from "@/pages/Index";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { EmployeeLayout } from "@/components/employee/layout/EmployeeLayout";
import { UnifiedLayout } from "@/components/dashboard/layout/UnifiedLayout";
import { Debug } from "@/pages/Debug";

function App() {
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Handle sign out
        console.log('User signed out');
      } else if (event === 'SIGNED_IN') {
        // Handle sign in
        console.log('User signed in:', session?.user?.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/debug" element={<Debug />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/employee/*" element={
          <ProtectedRoute>
            <EmployeeLayout>
              <Outlet />
            </EmployeeLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <UnifiedLayout>
              <Outlet />
            </UnifiedLayout>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </>
  );
}

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default App;