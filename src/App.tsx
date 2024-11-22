import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Index } from "@/pages/Index";
import { Login } from "@/pages/Login";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { RegisterAffiliate } from "@/pages/RegisterAffiliate";
import { Debug } from "@/pages/Debug";
import { supabase } from "@/integrations/supabase/client";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";

function App() {
  const [session, setSession] = useState(null);
  const [impersonatedUser, setImpersonatedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkImpersonation(session.user.email);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkImpersonation(session.user.email);
      } else {
        setImpersonatedUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkImpersonation = async (email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (!error && data) {
      setImpersonatedUser(data);
    }
  };

  return (
    <>
      {impersonatedUser && (
        <ImpersonationBanner
          userEmail={impersonatedUser.email}
          onExit={() => setImpersonatedUser(null)}
        />
      )}
      <Routes>
        <Route path="/" element={session ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAffiliate />} />
        <Route path="/debug" element={<Debug />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;