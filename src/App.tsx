import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { RecommendedConfig } from "@/pages/RecommendedConfig";
import { Debug } from "@/pages/Debug";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { Login } from "@/pages/Login";
import { RegisterAffiliate } from "@/pages/RegisterAffiliate";
import { AffiliateDashboard } from "@/pages/AffiliateDashboard";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/recommended-config" element={<RecommendedConfig />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-affiliate" element={<RegisterAffiliate />} />
        <Route path="/affiliate-dashboard" element={<AffiliateDashboard />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;