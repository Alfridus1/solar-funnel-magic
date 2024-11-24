import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Login } from "@/pages/Login";
import { EmployeeLogin } from "@/pages/EmployeeLogin";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/dashboard/*" element={<CustomerDashboard />} />
      </Routes>
      <Toaster />
    </>
  );
}