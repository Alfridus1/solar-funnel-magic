import { Routes, Route } from "react-router-dom";
import { Login } from "@/pages/Login";
import { EmployeeLogin } from "@/pages/EmployeeLogin";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { RecommendedConfig } from "@/pages/RecommendedConfig";
import { Toaster } from "@/components/ui/toaster";
import { Index } from "@/pages/Index";
import { AffiliateLanding } from "@/pages/AffiliateLanding";
import { ProductShowcase } from "@/components/solar-showcase/ProductShowcase";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/dashboard/*" element={<CustomerDashboard />} />
        <Route path="/recommended-config" element={<RecommendedConfig />} />
        <Route path="/solar-showcase" element={<ProductShowcase />} />
        <Route path="/affiliate" element={<AffiliateLanding />} />
      </Routes>
      <Toaster />
    </>
  );
}