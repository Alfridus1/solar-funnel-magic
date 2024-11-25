import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UnifiedLayout } from "./layout/UnifiedLayout";
import { DashboardOverview } from "./views/DashboardOverview";
import { RequestsOverview } from "./views/RequestsOverview";
import { ProjectsOverview } from "./views/ProjectsOverview";
import { ReferralOverview } from "./views/ReferralOverview";
import { DocumentsOverview } from "./views/DocumentsOverview";
import { SettingsOverview } from "./views/SettingsOverview";
import { ProfileOverview } from "./views/ProfileOverview";
import { LeadManagement } from "@/components/admin/LeadManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { AffiliateManagement } from "@/components/admin/AffiliateManagement";
import { EmployeeManagement } from "@/components/admin/EmployeeManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { PremiumProductsManagement } from "@/components/admin/PremiumProductsManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { TaskTypeManagement } from "@/components/admin/TaskTypeManagement";
import { AdminManagement } from "@/components/admin/AdminManagement";

export const UnifiedDashboard = () => {
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
      // Customer views
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
      
      // Admin/Employee views
      case "leads":
        return <LeadManagement />;
      case "users":
        return <UserManagement />;
      case "affiliates":
        return <AffiliateManagement />;
      case "employees":
        return <EmployeeManagement />;
      case "products":
        return <ProductManagement />;
      case "task-types":
        return <TaskTypeManagement />;
      case "premium":
        return <PremiumProductsManagement />;
      case "system-settings":
        return <SystemSettings />;
      case "admins":
        return <AdminManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <UnifiedLayout>
      {renderContent()}
    </UnifiedLayout>
  );
};