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
      <ScrollToTop />
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
          
          <Route path="/dashboard" element={<RoleRoute allowedRoles={["user"]} element={<UserDashboard />} />} />
          <Route path="/admin-dashboard" element={<RoleRoute allowedRoles={["admin"]} element={<AdminDashboard />} />} />
          <Route path="/doctor-dashboard" element={<RoleRoute allowedRoles={["doctor"]} element={<DoctorDashboard />} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
