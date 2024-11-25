import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EmployeeLayout } from "./layout/EmployeeLayout";
import { Overview } from "@/components/employee/Overview";
import { Tasks } from "@/components/employee/Tasks";
import { Team } from "@/components/employee/Team";
import { Calendar } from "@/components/employee/Calendar";
import { TimeTracking } from "@/components/employee/TimeTracking";
import { Settings } from "@/components/employee/Settings";

export const EmployeeDashboard = () => {
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
      case "tasks":
        return <Tasks />;
      case "team":
        return <Team />;
      case "calendar":
        return <Calendar />;
      case "time":
        return <TimeTracking />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <EmployeeLayout>
      {renderContent()}
    </EmployeeLayout>
  );
};