import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ProfileCompletionTracker = ({ user, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    photoURL: "",
    location: "",
    mobileNumber: "",
  });

  // Define only the fields that are truly optional
  const optionalFields = ["photoURL", "location", "mobileNumber"];

  const calculateProgress = (userObj) => {
    const filled = optionalFields.filter((field) => !!userObj[field]);
    return Math.round((filled.length / optionalFields.length) * 100);
  };

  const completionPercent = calculateProgress(user);

  const getMissingFields = (userObj) => {
    return optionalFields.filter((field) => !userObj[field]);
  };

  const missingFields = getMissingFields(user);

  useEffect(() => {
    setFormData({
      photoURL: user.photoURL || "",
      location: user.location || "",
      mobileNumber: user.mobileNumber || "",
    });

    if (missingFields.length > 0) {
      setShowModal(true);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Profile updated!");
      setShowModal(false);
      onUpdate(data.user); // update parent state
    } catch (err) {
      toast.error("Update failed.");
      console.error(err);
    }
  };

  if (completionPercent === 100) {
    return (
      <div className="mt-2 text-sm text-green-600 dark:text-green-400">
        ✅ Verified Profile — 100% complete!
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
          <div className="bg-white dark:bg-gray-900 max-w-md w-full rounded-2xl shadow-xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-center text-teal-600 dark:text-white">Complete Your Profile</h2>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Profiles with 100% completion get higher visibility and credibility
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
            <p className="text-center text-sm dark:text-gray-300">{completionPercent}% Complete</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {missingFields.includes("photoURL") && (
                <div>
                  <label htmlFor="photoURL" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    id="photoURL"
                    value={formData.photoURL}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                </div>
              )}
              {missingFields.includes("location") && (
                <div>
                  <label htmlFor="location" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                </div>
              )}
              {missingFields.includes("mobileNumber") && (
                <div>
                  <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-full font-semibold hover:opacity-90"
              >
                Update Now
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                Remind me later
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCompletionTracker;
