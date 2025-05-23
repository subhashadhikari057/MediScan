import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast"; // ✅ Add this
import CompleteProfile from "./pages/CompleteProfile"; // Adjust path as needed
import Profile from "pages/Profile";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster // ✅ Minimal themed toast setup
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f766e", // Tailwind teal-700
            color: "#fff",
            fontSize: "0.875rem",
            borderRadius: "10px",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}

export default App;
