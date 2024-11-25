import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { UnifiedSidebar } from "./layout/UnifiedSidebar";
import { DashboardOverview } from "./views/DashboardOverview";
import { RequestsOverview } from "./views/RequestsOverview";
import { ProjectsOverview } from "./views/ProjectsOverview";
import { ReferralOverview } from "./views/ReferralOverview";
import { DocumentsOverview } from "./views/DocumentsOverview";
import { ProfileOverview } from "./views/ProfileOverview";
import { SettingsOverview } from "./views/SettingsOverview";
import { Overview } from "@/components/admin/Overview";
import { LeadManagement } from "@/components/admin/LeadManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { AffiliateManagement } from "@/components/admin/AffiliateManagement";
import { EmployeeManagement } from "@/components/admin/EmployeeManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { TaskTypeManagement } from "@/components/admin/TaskTypeManagement";
import { PremiumProductsManagement } from "@/components/admin/PremiumProductsManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AdminManagement } from "@/components/admin/AdminManagement";
import { Tasks } from "@/components/employee/Tasks";
import { Team } from "@/components/employee/Team";
import { Calendar } from "@/components/employee/Calendar";
import { TimeTracking } from "@/components/employee/TimeTracking";
import { useLocation } from "react-router-dom";

export const UnifiedDashboard = () => {
  const location = useLocation();
  const currentTab = location.hash.replace("#", "") || "dashboard";

  const { data: userRoles, isLoading } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const { data: employees } = await supabase
        .from('employees')
        .select('role')
        .eq('profile_id', user.id);

      const employee = employees?.[0];

      return {
        isAdmin: profile?.role === 'admin',
        isEmployee: !!employee || profile?.role === 'admin'
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
      
      // Employee views
      case "tasks":
        return userRoles?.isEmployee ? <Tasks /> : null;
      case "team":
        return userRoles?.isEmployee ? <Team /> : null;
      case "calendar":
        return userRoles?.isEmployee ? <Calendar /> : null;
      case "time":
        return userRoles?.isEmployee ? <TimeTracking /> : null;
      
      // Admin views
      case "overview":
        return userRoles?.isAdmin ? <Overview /> : null;
      case "leads":
        return userRoles?.isAdmin ? <LeadManagement /> : null;
      case "users":
        return userRoles?.isAdmin ? <UserManagement /> : null;
      case "affiliates":
        return userRoles?.isAdmin ? <AffiliateManagement /> : null;
      case "employees":
        return userRoles?.isAdmin ? <EmployeeManagement /> : null;
      case "products":
        return userRoles?.isAdmin ? <ProductManagement /> : null;
      case "task-types":
        return userRoles?.isAdmin ? <TaskTypeManagement /> : null;
      case "premium":
        return userRoles?.isAdmin ? <PremiumProductsManagement /> : null;
      case "system-settings":
        return userRoles?.isAdmin ? <SystemSettings /> : null;
      case "admins":
        return userRoles?.isAdmin ? <AdminManagement /> : null;
      
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen">
      <UnifiedSidebar userRoles={userRoles} />
      <main className="flex-1 overflow-y-auto p-8">
        {renderContent()}
      </main>
    </div>
  );
};