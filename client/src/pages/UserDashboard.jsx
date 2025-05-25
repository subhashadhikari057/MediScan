import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { CalendarDays } from "lucide-react";
import SecureInfoBanner from "../components/SecureInfoBanner";
import HealthTipBox from "../components/HealthTipBox";


const formatTimeTo12Hour = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string" || !timeStr.includes(":")) {
    return "Invalid time";
  }
  const [hour, minute] = timeStr.split(":");
  const date = new Date();
  date.setHours(+hour);
  date.setMinutes(+minute);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view appointments.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(res.data.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "approved":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4 md:px-12 bg-gray-50 dark:bg-gray-900">
  {/* Top Secure Banner */}
  <div className="mb-6">
    <SecureInfoBanner />
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    {/* Health Tip on left */}
    <div className="lg:col-span-1">
      <div className="sticky top-28">
        <HealthTipBox />
      </div>
    </div>

    {/* Appointments on right */}
    <div className="lg:col-span-3">
      <h1 className="text-3xl font-bold text-primary mb-6">My Appointments</h1>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading appointments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">You have no appointments yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition-all"
            >
              <h2 className="text-lg font-semibold text-teal-600 dark:text-cyan-400">
                {appt.doctorId.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {appt.doctorId.specialization} • {appt.doctorId.location}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <CalendarDays className="w-5 h-5" />
                {appt.date} at {formatTimeTo12Hour(appt.time)}
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Reason: {appt.reason || "N/A"}
              </p>

              <span
                className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                  appt.status
                )}`}
              >
                Status: {appt.status}
              </span>

              {appt.status === "cancelled" && appt.cancellationReason && (
                <p className="text-sm text-red-400 mt-2">Reason: {appt.cancellationReason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</main>

      <Footer />
    </>
  );
};

export default UserDashboard;
