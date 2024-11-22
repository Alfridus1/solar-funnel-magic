import { Routes, Route } from "react-router-dom";
import { Index } from "./pages/Index";
import { AffiliateLanding } from "./pages/AffiliateLanding";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { CustomerDashboard } from "./components/dashboard/CustomerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/affiliate" element={<AffiliateLanding />} />
      <Route path="/dashboard" element={<CustomerDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;