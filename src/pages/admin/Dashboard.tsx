import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { Overview } from "@/components/admin/Overview";
import { LeadManagement } from "@/components/admin/LeadManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { PremiumProductsManagement } from "@/components/admin/PremiumProductsManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AffiliateManagement } from "@/components/admin/AffiliateManagement";

export const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.hash.replace("#", "") || "overview";

  useEffect(() => {
    if (!location.hash) {
      navigate("#overview", { replace: true });
    }
  }, [location, navigate]);

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
      case "products":
        return <ProductManagement />;
      case "premium":
        return <PremiumProductsManagement />;
      case "settings":
        return <SystemSettings />;
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