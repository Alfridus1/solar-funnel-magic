import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { RecommendedConfig } from "@/pages/RecommendedConfig";
import { RoofAnalysis } from "@/pages/RoofAnalysis";
import { Login } from "@/pages/Login";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/roof-analysis" element={<RoofAnalysis />} />
        <Route path="/recommended-config" element={<RecommendedConfig />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;