import { useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { Overview } from "@/components/admin/Overview";
import { LeadManagement } from "@/components/admin/LeadManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { AffiliateManagement } from "@/components/admin/AffiliateManagement";
import { EmployeeManagement } from "@/components/admin/EmployeeManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { PremiumProductsManagement } from "@/components/admin/PremiumProductsManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { TaskTypeManagement } from "@/components/admin/TaskTypeManagement";
import { AdminManagement } from "@/components/admin/AdminManagement";
import { APIDebugger } from "@/components/admin/APIDebugger";
import { RoleManagement } from "@/components/admin/RoleManagement";
import { LandingPageContent } from "@/components/admin/landing-page/LandingPageContent";

export const AdminDashboard = () => {
  const location = useLocation();
  const currentTab = location.hash.replace("#", "") || "overview";

  const renderContent = () => {
    switch (currentTab) {
      case "overview":
        return <Overview />;
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
      case "settings":
        return <SystemSettings />;
      case "admins":
        return <AdminManagement />;
      case "roles":
        return <RoleManagement />;
      case "api-debug":
        return <APIDebugger />;
      case "landing-page":
        return <LandingPageContent />;
      default:
        return <Overview />;
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};
