import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Index } from "@/pages/Index";
import { Login } from "@/pages/Login";
import { EmployeeLogin } from "@/pages/EmployeeLogin";
import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { EmployeeDashboard } from "@/pages/employee/Dashboard";
import { AdminDashboard } from "@/pages/admin/Dashboard";

const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      setUserRole(profile?.role || null);
      setIsAuthenticated(!!session);
      setIsLoading(false);

      if (profile?.role && allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
        toast({
          title: "Zugriff verweigert",
          description: "Sie haben keine Berechtigung für diesen Bereich.",
          variant: "destructive",
        });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserRole(null);
      } else if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setUserRole(profile?.role || null);
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />

        {/* Customer routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Employee routes */}
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute allowedRoles={['sales_employee', 'customer_service', 'planning', 'accountant', 'construction_manager', 'installation_manager', 'installer', 'executive', 'sales_team_leader', 'sales_director']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;