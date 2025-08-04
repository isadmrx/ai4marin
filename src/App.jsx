import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import CrewDashboard from './pages/CrewDashboard';
import VendorDashboard from './pages/VendorDashboard';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-4 flex justify-between items-center border-b mb-4">
        <div className="flex gap-4">
          <Link to="/login/shipowner">Owner</Link>
          <Link to="/login/crew">Crew</Link>
          <Link to="/login/vendor">Vendor</Link>
        </div>
        <LanguageSwitcher />
      </div>
      <Routes>
        <Route path="/register/:role" element={<Register />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/crew/dashboard" element={<CrewDashboard />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
