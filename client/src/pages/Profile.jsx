import React, { useState, useEffect } from "react";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import CompleteProfilePrompt from "../components/CompleteProfilePrompt";



const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    photoURL: "",
    mobile: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    photoURL: "",
    mobile: "",
    location: "",
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
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        setFormData({
          name: data.name || "",
          photoURL: data.photoURL || "",
          mobile: data.mobile || "",
          location: data.location || "", 
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
  if (e) e.preventDefault();

  // Prevent fields that were previously filled from being cleared
  const uneditableEmptyFields = [];
  if (user.name && formData.name.trim() === "") uneditableEmptyFields.push("Name");
  if (user.photoURL && formData.photoURL.trim() === "") uneditableEmptyFields.push("Profile Image URL");
  if (user.mobile && formData.mobile.trim() === "") uneditableEmptyFields.push("Mobile Number");
  if (user.location && formData.location.trim() === "") uneditableEmptyFields.push("Location");

  if (uneditableEmptyFields.length > 0) {
    toast.error(`You cannot empty: ${uneditableEmptyFields.join(", ")}`);
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const payload = {
      name: formData.name,
      photoURL: formData.photoURL,
      mobile: formData.mobile,
      location: formData.location,
    };

    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/update-profile`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

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
    return words[0][0]?.toUpperCase() + (words[1]?.[0]?.toUpperCase() || "");
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <>
      <Navbar />
      <CompleteProfilePrompt />
      <section className="min-h-screen bg-white dark:bg-gray-900 px-4 py-16 flex justify-center items-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover border shadow-sm" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-cyan-600 text-white flex items-center justify-center text-2xl font-bold shadow">
                {getInitials(user.name)}
              </div>
            )}
            <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>

          {!editMode ? (
            <div className="space-y-4 px-2">
              <div className="flex justify-between border-b py-2">
                <span className="text-gray-500">Name</span>
                <span className="text-gray-900 dark:text-white">{user.name}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-gray-500">Email account</span>
                <span className="text-gray-900 dark:text-white">{user.email}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-gray-500">Mobile number</span>
                <span className="text-gray-900 dark:text-white">{user.mobile || "Add number"}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-gray-500">Location</span>
                <span className="text-gray-900 dark:text-white">{user.location || "Not set"}</span>
              </div>

              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-full font-semibold"
                >
                  Edit Info
                </button>
                <button
                  onClick={() => setPasswordModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
                >
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => {
  e.preventDefault();
  setShowConfirmModal(true);
}}>
              <div>
                <label htmlFor="name" className="block text-sm text-gray-600 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
  <label htmlFor="mobile" className="block text-sm text-gray-600 dark:text-gray-300">Mobile Number</label>
  <input
    type="tel"
    id="mobile"
    value={formData.mobile}
    onChange={(e) => {
      const val = e.target.value.replace(/\D/g, "").slice(0, 10); // only digits, max 10
      setFormData((prev) => ({ ...prev, mobile: val }));
    }}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
    placeholder="Enter 10-digit mobile number"
  />
</div>
              <div>
              <label htmlFor="location" className="block text-sm text-gray-600 dark:text-gray-300">Location</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
            </div>            

              <div>
                <label htmlFor="photoURL" className="block text-sm text-gray-600 dark:text-gray-300">Profile Image URL</label>
                <input
                  type="text"
                  id="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-full">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:text-white px-6 py-2 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

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
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full">
                  Update Password
                </button>
                <button type="button" onClick={() => setPasswordModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showConfirmModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm shadow-lg space-y-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center">Confirm Changes</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Are you sure you want to update your profile?</p>
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={() => {
            handleEditSubmit(); // now safe to call
            setShowConfirmModal(false);
          }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full"
        >
          Yes, Save
        </button>
        <button
          onClick={() => setShowConfirmModal(false)}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      <Footer />
    </>
  );
};

export default Profile;
