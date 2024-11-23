import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "../LoginForm";
import { RegistrationForm } from "./RegistrationForm";

interface RegistrationOverlayProps {
  onComplete: () => void;
  isAuthenticated: boolean;
}

export const RegistrationOverlay = ({ onComplete, isAuthenticated }: RegistrationOverlayProps) => {
  const [showLogin, setShowLogin] = useState(false);

  // Wenn der Benutzer bereits eingeloggt ist, zeigen wir das Overlay nicht an
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl animate-fade-up">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {showLogin ? "Anmelden" : "Ihre persönliche Solaranalyse"}
          </h2>
          <p className="text-gray-600">
            {showLogin 
              ? "Melden Sie sich an, um Ihre Solaranalyse zu sehen"
              : "Geben Sie Ihre Daten ein, um Ihre individuelle Auswertung zu sehen"}
          </p>
        </div>

        {showLogin ? (
          <LoginForm 
            onBack={() => setShowLogin(false)}
            onSuccess={onComplete}
          />
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