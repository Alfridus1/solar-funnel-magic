import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { RecommendedConfig } from "@/pages/RecommendedConfig";
import { Debug } from "@/pages/Debug";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/recommended-config" element={<RecommendedConfig />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;