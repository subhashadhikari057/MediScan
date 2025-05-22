import React, { useState } from "react";
import axios from "axios";
import { Facebook, Twitter } from "lucide-react";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    licenseNumber: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        role,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        payload
      );
      alert("Registration successful! Please login.");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
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
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
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
                <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  <Facebook className="w-4 h-4" />
                  Continue with Facebook
                </button>
                <button className="flex items-center justify-center gap-2 bg-sky-400 text-white py-2 rounded-lg hover:bg-sky-500 transition">
                  <Twitter className="w-4 h-4" />
                  Continue with Twitter
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
