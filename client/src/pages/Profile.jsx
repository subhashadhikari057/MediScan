import React, { useState, useEffect } from "react";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { Pencil } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    specialization: "",
    licenseNumber: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    specialization: "", // ✅
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(data);
        setFormData({
          name: data.name,
          location: data.location || "",
          specialization: data.specialization || "",
        });
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        toast.error("Failed to load profile.");
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: formData.name,
        location: formData.location,
      };
      if (user.role === "doctor") {
        payload.specialization = formData.specialization;
      }
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/update-profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Profile updated!");
      setEditMode(false);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      toast.error("Update failed.");
      console.error(err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully!");
      setPasswordModal(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed.");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    const first = words[0]?.charAt(0).toUpperCase() || "";
    const last = words[1]?.charAt(0).toUpperCase() || "";
    return first + last;
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-[#E0F7FA] to-white dark:from-gray-900 dark:to-gray-800 px-4 py-16 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl w-full max-w-3xl p-8 md:p-12 space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">My Profile</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your personal information</p>
          </div>

          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-cyan-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {getInitials(user.name)}
            </div>
          </div>

          {!editMode ? (
            <div className="text-gray-700 dark:text-gray-200 space-y-3 px-4 md:px-8">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role === "doctor" ? "Doctor" : user.role}</p>
              <p><strong>Location:</strong> {user.location || "Not set"}</p>
              {user.role === "doctor" && (
                <>
                  <p><strong>Specialization:</strong> {user.specialization || "Not set"}</p>
                  <p><strong>License Number:</strong> {user.licenseNumber || "Not set"}</p>
                </>
              )}
              <div className="text-center pt-6 flex flex-col items-center gap-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-5 py-2 rounded-full transition duration-200"
                >
                  <Pencil className="w-4 h-4 mr-2" /> Edit Name & Location
                </button>
                <button
                  onClick={() => setPasswordModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full"
                >
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6 px-4 md:px-8" onSubmit={handleEditSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Location</label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              {user.role === "doctor" && (
                <div className="space-y-2">
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Specialization</label>
                  <input
                    type="text"
                    id="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-600 to-blue-500 hover:opacity-90 transition text-white font-semibold py-2 px-6 rounded-full"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-white py-2 px-6 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Password Change Modal */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, oldPassword: e.target.value }))}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setPasswordModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Profile;
