import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import AffiliateLanding from "./pages/affiliate";
import AdminDashboard from "./components/admin/AdminDashboard";
import { CustomerDashboard } from "./components/dashboard/CustomerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/affiliate" element={<AffiliateLanding />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
