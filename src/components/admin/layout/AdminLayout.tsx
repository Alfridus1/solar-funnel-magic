import { ReactNode, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Nicht authentifiziert",
          description: "Bitte melden Sie sich an, um fortzufahren.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        toast({
          title: "Zugriff verweigert",
          description: "Sie haben keine Berechtigung für den Admin-Bereich.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
    };

    checkAdminAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role !== 'admin') {
          toast({
            title: "Zugriff verweigert",
            description: "Sie haben keine Berechtigung für den Admin-Bereich.",
            variant: "destructive",
          });
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};