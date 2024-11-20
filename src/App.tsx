import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { RecommendedConfig } from "@/pages/RecommendedConfig";
import Debug from "@/pages/Debug";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/recommended-config" element={<RecommendedConfig />} />
        <Route path="/debug" element={<Debug />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;