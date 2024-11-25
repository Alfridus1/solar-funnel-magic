import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UnifiedSidebarProps {
  children: React.ReactNode;
}

export const UnifiedSidebar = ({ children }: UnifiedSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!profile) {
          // Create a default profile if none exists
          const { error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                first_name: 'User',
                last_name: session.user.email?.split('@')[0] || 'Unknown',
                email: session.user.email,
                phone: ''
              }
            ]);

          if (createError) {
            throw createError;
          }

          setUserName('User');
        } else {
          setUserName(`${profile.first_name} ${profile.last_name}`);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchUserProfile();
  }, [navigate, toast]);

  return (
    <div className={cn(
      "relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-screen",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? ">" : "<"}
      </Button>

      <div className="p-6">
        <h2 className={cn(
          "text-2xl font-bold text-gray-800 dark:text-white transition-all duration-300",
          isCollapsed && "text-center text-xl"
        )}>
          {isCollapsed ? userName.charAt(0) : userName}
        </h2>
      </div>

      <nav className="space-y-1 px-3">
        {children}
      </nav>
    </div>
  );
};