import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  Calendar,
  Stethoscope,
  ChevronRight,
  Clock,
} from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats({
          totalUsers: res.data.totalUsers,
          totalDoctors: res.data.totalDoctors,
          totalAppointments: res.data.totalAppointments,
        });
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
      description: "Active patients",
    },
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      change: "+5%",
      trend: "up",
      icon: UserCheck,
      color: "bg-emerald-500",
      description: "Verified physicians",
    },
    {
      title: "Appointments",
      value: stats.totalAppointments,
      change: "0%",
      trend: "neutral",
      icon: Calendar,
      color: "bg-orange-500",
      description: "Scheduled today",
    },
  ];

  const managementCards = [
    {
      title: "Manage Users",
      description: "View, filter, and manage registered users in the system",
      icon: Users,
      bg: "bg-blue-50 border border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:border-blue-700 dark:hover:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
      route: "/admin/manage-users",
    },
    {
      title: "Manage Doctors",
      description: "See all verified doctors and manage their profiles",
      icon: Stethoscope,
      bg: "bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:border-emerald-700 dark:hover:bg-emerald-900",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      route: "/admin/manage-doctors",
    },
    {
      title: "Manage Appointments",
      description: "View all appointments and edit their timing if needed",
      icon: Calendar,
      bg: "bg-violet-50 border border-violet-200 hover:bg-violet-100 dark:bg-violet-950 dark:border-violet-700 dark:hover:bg-violet-900",
      iconColor: "text-orange-600 dark:text-orange-400",
      route: "/admin/manage-appointments",
    },
    {
      title: "Cleanup Logs",
      description: "View deleted cancelled appointments after 24 hours",
      icon: Clock,
      bg: "bg-rose-50 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950 dark:border-rose-700 dark:hover:bg-rose-900",
      iconColor: "text-rose-600 dark:text-rose-400",
      route: "/admin/cleanup-logs",
}

  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <Navbar />

      {/* Padding added after navbar */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-10">
          <h1 className="text-3xl text-teal-600 font-bold">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300">Monitor and manage your MediScan platform</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-slate-500"}`}>{stat.change}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="text-white w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Manage Cards */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">Manage Resources</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Access and control platform data</p>
          <div className="grid md:grid-cols-3 gap-6">
            {managementCards.map((card, i) => (
              <div
                key={i}
                onClick={() => navigate(card.route)}
                className={`cursor-pointer p-6 rounded-xl transition-all ${card.bg}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800`}>
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <ChevronRight className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-teal-500 to-emerald-600 p-8 rounded-2xl text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
  <div>
    <h3 className="text-2xl font-bold mb-1">Need Help?</h3>
    <p className="text-teal-100">Access documentation or contact support</p>
  </div>
  <div className="flex flex-wrap gap-4">
    <button
      onClick={() => navigate("/documentation")}
      className="bg-white text-teal-600 dark:text-teal-700 px-6 py-2 rounded-md flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
    >
      <Clock className="w-4 h-4" />
      <span className="font-medium">View Documentation</span>
    </button>
  </div>
</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
