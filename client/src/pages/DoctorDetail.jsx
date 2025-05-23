import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getInitials = (name) => {
    const parts = name?.split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/doctors/${id}`);
        setDoctor(data);
      } catch (err) {
        setError("Failed to load doctor details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading doctor details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/doctors")}
          className="text-teal-600 hover:underline mb-6 text-sm"
        >
          ← Back to Doctor List
        </button>

        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
          {/* Avatar */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl font-bold">
            {getInitials(doctor.name)}
          </div>

          {/* Basic Info */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{doctor.name}</h2>
          <p className="text-teal-600 font-medium mt-1">{doctor.specialization}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">📍 {doctor.location}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1"> License No: {doctor.licenseNumber || "Not Available"}</p>

          {/* Description */}
          <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Dr. {doctor.name} is an experienced {doctor.specialization} based in {doctor.location}.
              This profile is verified and trusted by MediScan.
            </p>
          </div>

          {/* Static Reviews */}
          <div className="mt-8 text-left">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Patient Reviews</h3>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li>⭐ “Very professional and helpful!”</li>
              <li>⭐ “Took time to explain everything in detail.”</li>
              <li>⭐ “Highly recommend to anyone needing expert care.”</li>
              <li>⭐ “Kind and compassionate throughout the visit.”</li>
            </ul>
          </div>

          {/* Book Appointment Button */}
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate(`/book/${doctor._id}`)}
              className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-full transition-all"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDetail;
