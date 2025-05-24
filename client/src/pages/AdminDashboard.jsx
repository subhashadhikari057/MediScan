import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { Users, UserPlus, CalendarCheck } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/dashboard/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      }
    };

    fetchStats();
  }, []);

  const Card = ({ icon: Icon, label, value }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition-all">
      <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary text-white">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
        <p className="text-xl font-bold text-primary dark:text-cyan-400">{value}</p>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 md:px-12 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card icon={Users} label="Total Users" value={stats.totalUsers} />
          <Card icon={UserPlus} label="Total Doctors" value={stats.totalDoctors} />
          <Card icon={CalendarCheck} label="Appointments" value={stats.totalAppointments} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;
