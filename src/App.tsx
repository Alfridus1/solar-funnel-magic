import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AdminLayout } from "./components/admin/layout/AdminLayout";
import { Overview } from "./components/admin/Overview";
import { UserManagement } from "./components/admin/UserManagement";
import { LeadManagement } from "./components/admin/LeadManagement";
import { RoleManagement } from "./components/admin/RoleManagement";
import { APIDebugger } from "./components/admin/APIDebugger";
import { AffiliateManagement } from "./components/admin/AffiliateManagement";
import { EmployeeManagement } from "./components/admin/EmployeeManagement";
import { ProductManagement } from "./components/admin/ProductManagement";
import { SystemSettings } from "./components/admin/SystemSettings";
import { NewsManagement } from "./components/admin/marketing/NewsManagement";
import { EmployeeLayout } from "./components/employee/layout/EmployeeLayout";
import { Overview as EmployeeOverview } from "./components/employee/Overview";
import { Tasks } from "./components/employee/Tasks";
import { Team } from "./components/employee/Team";
import { Calendar } from "./components/employee/Calendar";
import { TimeTracking } from "./components/employee/TimeTracking";
import { Settings } from "./components/employee/Settings";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
            <Route path="dashboard" element={<Overview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="leads" element={<LeadManagement />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="api-debug" element={<APIDebugger />} />
            <Route path="affiliates" element={<AffiliateManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="marketing" element={<NewsManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>

          <Route path="/employee" element={<EmployeeLayout><Outlet /></EmployeeLayout>}>
            <Route index element={<EmployeeOverview />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="team" element={<Team />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="time" element={<TimeTracking />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;