import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { ConsumptionPage } from "@/pages/configurator/ConsumptionPage";
import { ModulesPage } from "@/pages/configurator/ModulesPage";
import { InverterPage } from "@/pages/configurator/InverterPage";
import { BatteryPage } from "@/pages/configurator/BatteryPage";
import { SummaryPage } from "@/pages/configurator/SummaryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/configurator/consumption" element={<ConsumptionPage />} />
        <Route path="/configurator/modules" element={<ModulesPage />} />
        <Route path="/configurator/inverter" element={<InverterPage />} />
        <Route path="/configurator/battery" element={<BatteryPage />} />
        <Route path="/configurator/summary" element={<SummaryPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;