import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { Clock } from "lucide-react";

const AdminCleanupLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/cleanup-logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching cleanup logs:", err);
        setError("Failed to fetch logs. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-teal-600 mb-6">Deleted Appointments Log</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
          View history of auto-deleted cancelled appointments older than 24 hours.
        </p>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-300">Loading logs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : logs.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-300">No cleanup logs found.</p>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 mb-6 shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-rose-600">
                  🧹 {log.deletedCount} Appointments Deleted
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="inline-block w-4 h-4 mr-1" />
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <ul className="text-sm space-y-3">
                {log.deletedAppointments.map((a, index) => (
                  <li
                    key={index}
                    className="border-l-4 pl-4 border-rose-500 dark:border-rose-400 bg-rose-50 dark:bg-rose-950 py-2 rounded"
                  >
                    <div className="font-medium">
                      {a.userName} → {a.doctorName}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      Date: {a.date}, Time: {a.time}, Reason: {a.reason}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminCleanupLogs;
