import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Index } from "@/pages/Index";
import { RoofCheck } from "@/components/RoofCheck";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { ResetPassword } from "@/pages/ResetPassword";
import { Dashboard } from "@/pages/Dashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { EmployeeLogin } from "@/pages/EmployeeLogin";
import { SolarShowcase } from "@/pages/SolarShowcase";
import { Configurator } from "@/pages/Configurator";
import { NotFound } from "@/pages/NotFound";
import { Debug } from "@/pages/Debug";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/roof-check" element={<RoofCheck />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/solar-showcase" element={<SolarShowcase />} />
        <Route path="/configurator/*" element={<Configurator />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;