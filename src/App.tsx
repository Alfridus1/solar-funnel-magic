import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { RecommendedConfig } from "@/pages/RecommendedConfig";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/recommended-config" element={<RecommendedConfig />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;