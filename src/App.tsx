import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { RecommendedConfig } from "@/pages/RecommendedConfig";
import { RoofAnalysis } from "@/pages/RoofAnalysis";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Dashboard } from "@/pages/Dashboard";
import { Profile } from "@/pages/Profile";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/roof-analysis" element={<RoofAnalysis />} />
          <Route path="/recommended-config" element={<RecommendedConfig />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
