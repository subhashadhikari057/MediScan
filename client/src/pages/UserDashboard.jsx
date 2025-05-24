import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { CalendarDays } from "lucide-react";

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/dashboard/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data.data);
      } catch (err) {
        console.error("Error fetching user appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 md:px-12 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-primary mb-6">My Appointments</h1>

        {appointments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">You have no appointments yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appt) => (
              <div key={appt._id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-primary">{appt.doctorId.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {appt.doctorId.specialization} • {appt.doctorId.location}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <CalendarDays className="w-5 h-5" />
                  {appt.date} at {appt.time}
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Reason: {appt.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default UserDashboard;
