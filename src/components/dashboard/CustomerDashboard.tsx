import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomerLayout } from "./layout/CustomerLayout";
import { DashboardOverview } from "./views/DashboardOverview";
import { RequestsOverview } from "./views/RequestsOverview";
import { ProjectsOverview } from "./views/ProjectsOverview";
import { ReferralOverview } from "./views/ReferralOverview";
import { DocumentsOverview } from "./views/DocumentsOverview";
import { SettingsOverview } from "./views/SettingsOverview";
import { ProfileOverview } from "./views/ProfileOverview";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const CustomerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.hash.replace("#", "") || "dashboard";

  useEffect(() => {
    if (!location.hash) {
      navigate("#dashboard", { replace: true });
    }
  }, [location, navigate]);

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "requests":
        return <RequestsOverview />;
      case "projects":
        return <ProjectsOverview />;
      case "referral":
        return <ReferralOverview />;
      case "documents":
        return <DocumentsOverview />;
      case "profile":
        return <ProfileOverview />;
      case "settings":
        return <SettingsOverview />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Kundenbereich</CardTitle>
        </CardHeader>
        <CustomerLayout>
          {renderContent()}
        </CustomerLayout>
      </Card>
    </div>
  );
};