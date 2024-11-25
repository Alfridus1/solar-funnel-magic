import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";
import { UserManagement } from "./pages/UserManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
