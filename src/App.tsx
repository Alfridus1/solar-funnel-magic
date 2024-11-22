import { Routes, Route, Navigate } from "react-router-dom";
import { Index } from "@/pages/Index";
import { RecommendedConfig } from "@/pages/RecommendedConfig";
import { Debug } from "@/pages/Debug";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { Login } from "@/pages/Login";
import { AffiliateLanding } from "@/pages/AffiliateLanding";
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
        <Route path="/affiliate" element={<AffiliateLanding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;