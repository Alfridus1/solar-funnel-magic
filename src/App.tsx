import { Routes, Route } from "react-router-dom";
import { CustomerDashboard } from "./components/dashboard/CustomerDashboard";
import { ProductShowcase } from "./components/solar-showcase/ProductShowcase";
import { SystemConfigurator } from "./components/SystemConfigurator";
import { Debug } from "./pages/Debug";
import { LeadDetails } from "./pages/LeadDetails";
import { Index } from "./pages/Index";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/solar-showcase" element={<ProductShowcase />} />
        <Route path="/system-configurator" element={<SystemConfigurator />} />
        <Route path="/anfrage/:id" element={<LeadDetails />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;