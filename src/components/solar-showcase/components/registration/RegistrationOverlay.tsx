import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "../LoginForm";
import { RegistrationForm } from "./RegistrationForm";
import { RegistrationHeader } from "./RegistrationHeader";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationOverlayProps {
  onComplete: () => void;
}

export const RegistrationOverlay = ({ onComplete }: RegistrationOverlayProps) => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount and when it changes
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        onComplete();
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuthed = !!session;
      setIsAuthenticated(isAuthed);
      if (isAuthed) {
        onComplete();
      }
    });

    return () => subscription.unsubscribe();
  }, [onComplete]);

  // If user is authenticated, don't show the overlay
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl animate-fade-up">
        <RegistrationHeader showLogin={showLogin} />
        
        {showLogin ? (
          <LoginForm onBack={() => setShowLogin(false)} />
        ) : (
          <RegistrationForm
            onComplete={onComplete}
            onShowLogin={() => setShowLogin(true)}
          />
        )}
      </Card>
    </div>
  );
};