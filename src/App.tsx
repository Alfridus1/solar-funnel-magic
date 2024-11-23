import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LeadManagement } from "./components/admin/LeadManagement";
import { UserManagement } from "./components/admin/UserManagement";
import { SystemConfigurator } from "./components/SystemConfigurator";
import { CustomerDashboard } from "./components/dashboard/CustomerDashboard";
import { ProductShowcase } from "./components/solar-showcase/ProductShowcase";
import { Debug } from "./pages/Debug";
import LeadDetails from "./pages/LeadDetails"; // Import the new LeadDetails component
import Index from "./pages/Index";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/debug" element={<Debug />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/solar-showcase" element={<ProductShowcase />} />
          <Route path="/admin/leads" element={<LeadManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/system-configurator" element={<SystemConfigurator />} />
          <Route path="/anfrage/:id" element={<LeadDetails />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
