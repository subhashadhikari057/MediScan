import React, { useState, useEffect } from "react";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { Pencil, Upload } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    photoURL: "",
    specialization: "",
    licenseNumber: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    password: "",
  });

  // 🔁 Fetch user profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = (localStorage.getItem("token"));
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(data);
        setFormData({
          name: data.name,
          location: data.location || "",
          password: "",
        });
        localStorage.setItem("user", JSON.stringify(data)); // sync updated info
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      // 📌 Upload logic to cloud (e.g. Cloudinary) to be added later
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const payload = {
        name: formData.name,
        location: formData.location,
        password: formData.password,
        // photoURL: optional in future
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/update-profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("✅ Profile updated successfully!");
      setEditMode(false);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      toast.error("Update failed. Try again.");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-[#E0F7FA] to-white dark:from-gray-900 dark:to-gray-800 px-4 py-16 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl w-full max-w-3xl p-8 md:p-12 space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">My Profile</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your personal information and account settings</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={
                  previewImage ||
                  user.photoURL ||
                  "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500 shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-cyan-600 hover:bg-cyan-700 transition-colors p-2 rounded-full cursor-pointer shadow-lg">
                  <Upload className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Role: {user.role}</span>
          </div>

          {!editMode ? (
            <div className="text-gray-700 dark:text-gray-200 space-y-3 px-4 md:px-8">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Location:</strong> {user.location || "Not set"}</p>
              {user.role === "doctor" && (
                <>
                  <p><strong>Specialization:</strong> {user.specialization || "Not set"}</p>
                  <p><strong>License Number:</strong> {user.licenseNumber || "Not set"}</p>
                </>
              )}
              <div className="text-center pt-6">
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-5 py-2 rounded-full transition duration-200"
                >
                  <Pencil className="w-4 h-4 mr-2" /> Edit Profile
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

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-300">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

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
      <Footer />
    </>
  );
};

export default Profile;
