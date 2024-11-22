import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomerLayout } from "./layout/CustomerLayout";
import { SolarSystemOverview } from "./views/SolarSystemOverview";
import { DocumentsOverview } from "./views/DocumentsOverview";
import { AffiliatesOverview } from "./views/AffiliatesOverview";
import { WalletOverview } from "./views/WalletOverview";
import { SettingsOverview } from "./views/SettingsOverview";

export const CustomerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.hash.replace("#", "") || "solar";

  useEffect(() => {
    if (!location.hash) {
      navigate("#solar", { replace: true });
    }
  }, [location, navigate]);

  const renderContent = () => {
    switch (currentTab) {
      case "solar":
        return <SolarSystemOverview />;
      case "documents":
        return <DocumentsOverview />;
      case "affiliates":
        return <AffiliatesOverview />;
      case "wallet":
        return <WalletOverview />;
      case "settings":
        return <SettingsOverview />;
      default:
        return <SolarSystemOverview />;
    }
  };

  return (
    <CustomerLayout>
      {renderContent()}
    </CustomerLayout>
  );
};