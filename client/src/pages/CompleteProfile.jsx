import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [role, setRole] = useState("user");
  const [location, setLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    specialization: "",
    licenseNumber: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("googleUser"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/signup");
    }
  }, [navigate]);

  // ✅ Fix: define handleChange to update formData
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: user.email,
        password: formData.password,
        role,
        specialization: role === "doctor" ? formData.specialization : "",
        licenseNumber: role === "doctor" ? formData.licenseNumber : "",
        location,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/complete-profile`,
        payload
      );

      const { token, user: updatedUser } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.removeItem("googleUser");

      toast.success("🎉 Profile completed and you're now logged in!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to complete profile");
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-teal-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-24">
        <div className="max-w-xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Complete Your Profile</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={user.name}
                readOnly
                disabled
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                disabled
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm text-gray-600 dark:text-gray-300">Create Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block mb-1 text-sm text-gray-600 dark:text-gray-300">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
              >
                <option value="user">User</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            {role === "doctor" && (
              <>
                <div>
                  <label htmlFor="specialization" className="block mb-1 text-sm text-gray-600 dark:text-gray-300">Specialization</label>
                  <input
                    id="specialization"
                    type="text"
                    onChange={handleChange}
                    placeholder="e.g. Cardiologist"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block mb-1 text-sm text-gray-600 dark:text-gray-300">License Number</label>
                  <input
                    id="licenseNumber"
                    type="text"
                    onChange={handleChange}
                    placeholder="e.g. DOC12345"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="location" className="block mb-1 text-sm text-gray-600 dark:text-gray-300">Location (optional)</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kathmandu"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg"
            >
              Save & Continue
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CompleteProfile;
