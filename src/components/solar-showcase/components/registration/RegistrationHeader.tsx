interface RegistrationHeaderProps {
  showLogin: boolean;
}

export const RegistrationHeader = ({ showLogin }: RegistrationHeaderProps) => {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {showLogin ? "Willkommen zurück" : "Ihre persönliche Solaranalyse"}
      </h2>
      <p className="text-gray-600">
        {showLogin 
          ? "Melden Sie sich an, um Ihre Solaranalyse zu sehen"
          : "Geben Sie Ihre Daten ein, um Ihre individuelle Auswertung zu sehen"}
      </p>
    </div>
  );
};