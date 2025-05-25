import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertTriangle, ArrowRight, X, User, MapPin, Phone } from "lucide-react";

const CompleteProfilePrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasShownHome = useRef(false);
  const hasShownProfile = useRef(false);

  useEffect(() => {
    const fetchAndCheckProfile = async () => {
      const isProfilePage = location.pathname === "/profile";

      // Prevent repeated toasts per session
      if (isProfilePage && hasShownProfile.current) return;
      if (!isProfilePage && hasShownHome.current) return;

      // Set respective flag
      if (isProfilePage) {
        hasShownProfile.current = true;
      } else {
        const alreadyPrompted = sessionStorage.getItem("profilePromptShown_home");
        if (alreadyPrompted === "true") return;
        hasShownHome.current = true;
      }

      try {
        const token = localStorage.getItem("token");
        const { data: user } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const requiredFields = {
          photoURL: { label: "Profile Picture", icon: User },
          location: { label: "Location", icon: MapPin },
          mobile: { label: "Mobile Number", icon: Phone },
        };

        const missing = Object.entries(requiredFields).filter(
          ([key]) => !user[key] || user[key].trim() === ""
        );

        if (missing.length > 0) {
          toast.custom(
            (t) => (
              <div
                className={`
                transform transition-all duration-300 ease-in-out
                ${t.visible ? "animate-in slide-in-from-top-5" : "animate-out slide-out-to-top-5"}
                bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800
                border border-orange-200 dark:border-orange-800/30
                rounded-xl p-5 shadow-lg shadow-orange-100/50 dark:shadow-orange-900/20
                max-w-sm w-full backdrop-blur-sm
                relative overflow-hidden
              `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-xl opacity-20 blur-sm"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Complete Your Profile</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {missing.length} field{missing.length > 1 ? "s" : ""} missing
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    {missing.map(([key, field]) => {
                      const IconComponent = field.icon;
                      return (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <IconComponent className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">{field.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      navigate("/profile");
                    }}
                    className="
                      w-full flex items-center justify-center gap-2 
                      bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600
                      text-white font-medium text-sm py-2.5 px-4 rounded-lg
                      transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                      shadow-md hover:shadow-lg
                    "
                  >
                    Complete Profile
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ),
            {
              duration: 12000,
              position: "top-right",
              style: {
                background: "transparent",
                boxShadow: "none",
              },
            }
          );

          if (!isProfilePage) {
            sessionStorage.setItem("profilePromptShown_home", "true");
          }
        }
      } catch (err) {
        console.error("Failed to check profile completion:", err);
      }
    };

    fetchAndCheckProfile();
  }, [navigate, location.pathname]);

  return null;
};

export default CompleteProfilePrompt;
