import { useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { Overview } from "@/components/admin/Overview";
import { LeadManagement } from "@/components/admin/LeadManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { AffiliateManagement } from "@/components/admin/AffiliateManagement";
import { EmployeeManagement } from "@/components/admin/EmployeeManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { TaskTypeManagement } from "@/components/admin/TaskTypeManagement";
import { APIDebugger } from "@/components/admin/APIDebugger";
import { RoleManagement } from "@/components/admin/RoleManagement";
import { NewsManagement } from "@/components/admin/marketing/NewsManagement";

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
      case "settings":
        return <SystemSettings />;
      case "roles":
        return <RoleManagement />;
      case "api-debug":
        return <APIDebugger />;
      case "marketing":
        return <NewsManagement />;
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