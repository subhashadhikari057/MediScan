import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CompleteProfile from "./pages/CompleteProfile";
import Profile from "./pages/Profile";
import DoctorDiscovery from "./pages/DoctorDiscovery";
import DoctorDetail from "./pages/DoctorDetail";
import MediScanSplash from "./components/MediScanSplash";
import { Toaster } from "react-hot-toast";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import RoleRoute from "./components/RoleRoute";
import Documentation from "./pages/Documentation";
import BookAppointment from "./pages/BookAppointment";
import AdminCleanupLogs from "./pages/AdminCleanupLogs";
import ManageUsers from "./pages/ManageUsers";
import ManageDoctors from "./pages/ManageDoctors";
import ManageAppointments from "./pages/ManageAppointments";
import SymptomChecker from "./pages/SymptomChecker"; // Adjust path if needed
import HealthScan from "./pages/HealthScan";



function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasShownSplash = sessionStorage.getItem("splashShown");
    if (hasShownSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  };

  return (
    <Router>
      {/* Scrolls to top on every route change */}
      <ScrollToTop />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f766e",
            color: "#fff",
            fontSize: "0.875rem",
            borderRadius: "10px",
          },
        }}
      />

      {/* Splash screen or Main Routes */}
      {showSplash ? (
        <MediScanSplash onComplete={handleSplashComplete} />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/doctors" element={<DoctorDiscovery />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route
            path="/dashboard"
            element={<RoleRoute allowedRoles={["user"]} element={<UserDashboard />} />}
          />
          <Route
            path="/admin-dashboard"
            element={<RoleRoute allowedRoles={["admin"]} element={<AdminDashboard />} />}
          />
          <Route path="/admin/manage-users" element={<RoleRoute allowedRoles={["admin"]} element={<ManageUsers />} />} />
<Route path="/admin/manage-doctors" element={<RoleRoute allowedRoles={["admin"]} element={<ManageDoctors />} />} />
<Route path="/admin/manage-appointments" element={<RoleRoute allowedRoles={["admin"]} element={<ManageAppointments />} />} />
          <Route
            path="/doctor-dashboard"
            element={<RoleRoute allowedRoles={["doctor"]} element={<DoctorDashboard />} />}
          />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/book/:id" element={<BookAppointment />} />
          <Route
            path="/admin/cleanup-logs"element={<RoleRoute allowedRoles={["admin"]} element={<AdminCleanupLogs />} />}/>
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/healthscan" element={<HealthScan />} /> {/* ✅ Add this line */}
        </Routes>
      )}
    </Router>
  );
}

export default App;
