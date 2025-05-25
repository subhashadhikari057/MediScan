import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CalendarClock, Mail, X, Check } from "lucide-react";

const formatTimeTo12Hour = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string" || !timeStr.includes(":")) return "Invalid time";
  const [hour, minute] = timeStr.split(":");
  const date = new Date();
  date.setHours(+hour);
  date.setMinutes(+minute);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [updating, setUpdating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/doctor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching doctor appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleOpenModal = (appt) => {
    setSelectedAppt(appt);
    setStatus(appt.status);
    setReason(appt.cancellationReason || "");
    setNewDate(appt.date);
    setNewTime(appt.time);
  };

  const handleUpdateStatus = async () => {
    if (!status || !newDate || !newTime) return;
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/appointments/${selectedAppt._id}/status`,
        {
          status,
          cancellationReason: reason,
          date: newDate,
          time: newTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === selectedAppt._id
            ? { ...appt, status, cancellationReason: reason, date: newDate, time: newTime }
            : appt
        )
      );
      toast.success("Appointment updated successfully");
      setSelectedAppt(null);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update appointment");
    } finally {
      setUpdating(false);
    }
  };

  const handleViewLogs = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/${appointmentId}/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
      setShowLogs(true);
    } catch (err) {
      console.error("Log fetch failed:", err);
      toast.error("Failed to fetch appointment logs");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4 md:px-12 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-primary mb-6">Appointments with Patients</h1>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading appointments...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No appointments yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition-all space-y-3"
              >
                <h2 className="text-lg font-semibold text-teal-600 dark:text-cyan-400">{appt.userId.name}</h2>
                <a
                  href={`mailto:${appt.userId.email}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Mail className="w-4 h-4" /> {appt.userId.email}
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-300">{appt.userId.location}</p>

                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <CalendarClock className="w-5 h-5" />
                  {appt.date} at {formatTimeTo12Hour(appt.time)}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">Reason: {appt.reason}</p>

                {/* ✅ Medical Info */}
                {(appt.allergies || appt.medications || appt.conditions) && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {appt.allergies && <p>Allergies: {appt.allergies}</p>}
                    {appt.medications && <p>Medications: {appt.medications}</p>}
                    {appt.conditions && <p>Conditions: {appt.conditions}</p>}
                  </div>
                )}

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    appt.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : appt.status === "completed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : appt.status === "cancelled"
                      ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  Status: {appt.status}
                </span>

                {appt.status === "cancelled" && appt.cancellationReason && (
                  <p className="text-xs text-red-400 mt-1">Reason: {appt.cancellationReason}</p>
                )}

                <button
                  onClick={() => handleOpenModal(appt)}
                  className="mt-2 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg"
                >
                  Update / Reschedule
                </button>

                <button
                  onClick={() => handleViewLogs(appt._id)}
                  className="w-full mt-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-white py-1 rounded-lg"
                >
                  View Logs
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedAppt && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full relative">
              <button
                onClick={() => setSelectedAppt(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold mb-4 text-primary">Update Appointment</h3>

              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                disabled={status === "cancelled" || status === "completed"}
                className="w-full mb-3 px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              />

              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">New Time</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                disabled={status === "cancelled" || status === "completed"}
                className="w-full mb-3 px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              />

              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded-lg border bg-gray-100 dark:bg-white dark:border-gray-600"
              >
                <option value="">Select Status</option>
                <option value="approved">Approve</option>
                <option value="completed">Complete</option>
                <option value="cancelled">Cancel</option>
              </select>

              {status === "cancelled" && (
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for cancellation..."
                  className="w-full mb-4 px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                />
              )}

              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                {updating ? "Updating..." : <>Save <Check className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        )}

        {/* Logs Modal */}
        {showLogs && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto relative">
              <button
                onClick={() => setShowLogs(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold mb-4 text-primary">Appointment Logs</h3>

              {logs.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-300">No logs found.</p>
              ) : (
                <ul className="space-y-4">
                  {logs.map((log) => (
                    <li key={log._id} className="border-b dark:border-gray-700 pb-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Action:</strong> {log.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <strong>Changed By:</strong> {log.changedBy?.name} ({log.changedBy?.email})
                      </p>
                      {log.from && log.to && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <strong>From:</strong> {log.from} → <strong>To:</strong> {log.to}
                        </p>
                      )}
                      {log.note && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <strong>Note:</strong> {log.note}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        <strong>At:</strong> {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default DoctorDashboard;
