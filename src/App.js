import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import MenuPage from "./components/MenuPage";
import SuperAdminPanel from "./components/SuperAdminPanel";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/superadmin" element={<SuperAdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
