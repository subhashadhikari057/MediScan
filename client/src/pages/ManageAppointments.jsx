import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { Download, Pencil, Trash, ListOrdered } from "lucide-react";

const formatTimeToAMPM = (time24) => {
  if (!time24 || typeof time24 !== "string") return "Invalid time";
  const [hour, minute] = time24.split(":");
  const h = parseInt(hour);
  if (isNaN(h)) return "Invalid time";
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minute} ${suffix}`;
};

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [editAppt, setEditAppt] = useState(null);
  const [editForm, setEditForm] = useState({ date: "", time: "", status: "", reason: "" });
  const [logs, setLogs] = useState([]);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [confirmDeleteAppt, setConfirmDeleteAppt] = useState(null); // NEW STATE

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch {
      toast.error("Failed to fetch appointments");
    }
  };

  const fetchLogs = async (appointmentId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/appointments/${appointmentId}/logs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs(res.data);
      setLogModalOpen(true);
    } catch {
      toast.error("Failed to fetch appointment logs");
    }
  };

  const filtered = appointments.filter((a) =>
    a.doctorId.name.toLowerCase().includes(search.toLowerCase()) ||
    a.userId.name.toLowerCase().includes(search.toLowerCase())
  );

  const openEditModal = (appt) => {
    setEditAppt(appt);
    setEditForm({
      date: appt.date,
      time: appt.time,
      status: appt.status,
      reason: appt.cancellationReason || "",
    });
  };

  const saveEdit = async () => {
    if (editForm.status === "cancelled" && !editForm.reason?.trim()) {
      toast.error("Please provide a cancellation reason.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/admin/appointments/${editAppt._id}/status`,
        {
          date: editForm.date,
          time: editForm.time,
          status: editForm.status,
          cancellationReason: editForm.status === "cancelled" ? editForm.reason : "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Appointment updated");
      setEditAppt(null);
      fetchAppointments();
    } catch {
      toast.error("Failed to update appointment");
    }
  };

  const handleDeleteAppointment = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/appointments/${confirmDeleteAppt._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Appointment deleted");
      setConfirmDeleteAppt(null);
      fetchAppointments();
    } catch {
      toast.error("Failed to delete appointment");
    }
  };

  const exportCSV = () => {
    const header = ["User", "Doctor", "Date", "Time", "Status", "Reason"];
    const rows = appointments.map((a) => [
      a.userId.name,
      a.doctorId.name,
      a.date,
      formatTimeToAMPM(a.time),
      a.status,
      a.cancellationReason || "",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appointments.csv";
    a.click();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Manage Appointments</h1>
          <button
            onClick={exportCSV}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by doctor or user name"
          className="mb-6 w-full px-4 py-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
        />

        <div className="grid gap-4">
          {filtered.map((appt) => (
            <div
              key={appt._id}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-teal-600 dark:text-cyan-400">
                    {appt.userId.name} → {appt.doctorId.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {appt.date} at {formatTimeToAMPM(appt.time)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reason: {appt.reason || "N/A"}
                  </p>
                  <p className="text-xs mt-1">
                    Status:{" "}
                    <span className={`font-medium ${
                      appt.status === "cancelled"
                        ? "text-red-500"
                        : appt.status === "completed"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}>
                      {appt.status}
                    </span>
                  </p>
                  {appt.status === "cancelled" && appt.cancellationReason && (
                    <p className="text-xs text-red-400 mt-1">
                      Reason: {appt.cancellationReason}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openEditModal(appt)}
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteAppt(appt)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => fetchLogs(appt._id)}
                    className="text-indigo-600 dark:text-indigo-400"
                  >
                    <ListOrdered className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editAppt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Edit Appointment</h2>

              <label className="block mb-2 text-sm font-medium">Date</label>
              <input
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              />

              <label className="block mb-2 text-sm font-medium">Time</label>
              <input
                type="time"
                value={editForm.time}
                onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              />

              <label className="block mb-2 text-sm font-medium">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {editForm.status === "cancelled" && (
                <>
                  <label className="block mb-2 text-sm font-medium">Cancellation Reason</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 rounded-md border bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                    value={editForm.reason}
                    required
                  />
                </>
              )}

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setEditAppt(null)}
                  className="text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logs Modal */}
        {logModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Appointment Logs</h2>
              {logs.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-300">No logs available.</p>
              ) : (
                <ul className="space-y-4">
                  {logs.map((log) => (
                    <li
                      key={log._id}
                      className="border-b pb-2 dark:border-gray-600"
                    >
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
              <div className="mt-4 text-right">
                <button
                  onClick={() => setLogModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteAppt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                Confirm Deletion
              </h2>
              <p className="mb-6">
                Are you sure you want to delete the appointment between{" "}
                <strong>{confirmDeleteAppt.userId.name}</strong> and{" "}
                <strong>{confirmDeleteAppt.doctorId.name}</strong>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteAppt(null)}
                  className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAppointment}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ManageAppointments;
