import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CalendarDays, Clock, FileText } from "lucide-react";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState("AM");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        setError("Failed to load doctor details.");
      }
    };
    fetchDoctor();
  }, [id]);

  const formatTimeTo24Hour = () => {
    let h = parseInt(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${minute}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to book an appointment.");
        return;
      }

      const time = formatTimeTo24Hour();

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/appointments/book`,
        { doctorId: id, date, time, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Appointment booked successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to book appointment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Book Appointment with {doctor.name}
        </h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block mb-2 font-medium">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <CalendarDays className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Time (AM/PM format) */}
            <div>
              <label className="block mb-2 font-medium">Time</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  placeholder="HH"
                  className="w-20 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border dark:border-gray-600"
                  required
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  placeholder="MM"
                  className="w-20 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border dark:border-gray-600"
                  required
                />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border dark:border-gray-600"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
                <Clock className="text-gray-400" />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block mb-2 font-medium">Reason for Appointment</label>
              <div className="relative">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit..."
                  rows={4}
                  className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <FileText className="absolute top-3 right-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-semibold rounded-full transition-all"
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookAppointment;