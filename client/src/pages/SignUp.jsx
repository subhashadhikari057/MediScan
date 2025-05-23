import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const SignUp = () => {
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    licenseNumber: "",
  });

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, role };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, payload);
      toast.success("🎉 Registration successful! Please login.");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
    }
  };

  const handleGoogleSignUp = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // ✅ Call backend to save initial user
    await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });

    // ✅ Save to localStorage
    localStorage.setItem("googleUser", JSON.stringify({
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    }));

    toast.success("Almost done! Complete your profile.");
    navigate("/complete-profile");
  } catch (error) {
    console.error("Google Sign Up Error:", error);
    toast.error("Google sign-up failed. Try again.");
  }
};



  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white px-4 py-24 dark:from-gray-900 dark:to-gray-800">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl w-full items-center">
          <img
            src="/assets/doctors.svg"
            alt="Sign Up Illustration"
            className="w-full max-w-md mx-auto hidden md:block"
          />

          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 w-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
              Create Your MediScan Account
            </h2>

            {error && (
              <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded p-3 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="role" className="block text-gray-700 dark:text-gray-200 mb-2">
                  Register As
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                    aria-label="Toggle Password Visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {role === "doctor" && (
                <>
                  <div>
                    <label htmlFor="specialization" className="block text-gray-700 dark:text-gray-200 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Dermatologist"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="block text-gray-700 dark:text-gray-200 mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="e.g. NMC123456"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Sign Up
              </button>

              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="flex items-center justify-center gap-2 bg-teal-800 text-white py-2 rounded-lg hover:bg-teal-400 transition"
                >
                  <img src="/assets/google.svg" alt="Google" className="w-6 h-6" />
                  Continue with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SignUp;
