import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const tips = [
    "💡 Tip: Click on a doctor to learn more about their background and expertise.",
    "🔍 Tip: Use filters to find specialists by category.",
    "📇 Tip: Search by name to quickly locate doctors.",
    "📍 Tip: Profiles include location and specialization.",
    "🔒 Tip: We verify all doctors for your safety.",
  ];

  const reviews = [
    "💬 \"I found the best cardiologist here!\"",
    "💬 \"The search and filters made finding my doctor so easy.\"",
    "💬 \"Highly recommend this platform for verified specialists.\"",
    "💬 \"Clean design and very informative profiles.\"",
    "💬 \"Fast, reliable, and trustworthy doctors.\"",
    "💬 \"Loved how simple it was to navigate and find help.\"",
  ];

const DoctorDiscovery = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const [tipIndex, setTipIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  const specializations = ["Dermatology", "Cardiology", "Pediatrics", "Neurology", "Orthopedics"];

  

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/doctors`);
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let result = [...doctors];
    if (search) {
      result = result.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedSpecialization) {
      result = result.filter(
        (doc) => doc.specialization === selectedSpecialization
      );
    }
    setFilteredDoctors(result);
  }, [search, selectedSpecialization, doctors]);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 600000);
    const reviewTimer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 600000);
    return () => {
      clearInterval(tipTimer);
      clearInterval(reviewTimer);
    };
  }, []);

  const getInitials = (name) => {
    const parts = name.split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <div className="mt-16 max-w-7xl mx-auto px-4 py-8">
        <div className="md:hidden mb-6">
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSelectedSpecialization("")}
            className="mt-2 text-sm text-teal-600 dark:text-cyan-400 hover:underline"
          >
            Clear Filter
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          <aside className="hidden md:block w-full md:w-1/4 mb-8 md:mb-0 md:mr-24">
            <div className="sticky top-24 space-y-6">
              <input
                type="text"
                placeholder="Search doctors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <div>
                <h3 className="font-bold mb-2 text-gray-700 dark:text-white">Categories</h3>
                <ul className="space-y-1">
                  {specializations.map((category) => (
                    <li
                      key={category}
                      onClick={() => setSelectedSpecialization(category)}
                      className={`cursor-pointer px-2 py-1 rounded text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedSpecialization === category
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedSpecialization("")}
                  className="mt-2 text-sm text-teal-600 dark:text-cyan-400 hover:underline"
                >
                  Clear Filter
                </button>
              </div>

              <div className="border rounded-lg p-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                {tips[tipIndex]}
              </div>
              <div className="border rounded-lg p-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                {reviews[reviewIndex]}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Available Doctors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition flex flex-col items-center text-center"
                >
                  {doc.photoURL ? (
                    <img
                      src={doc.photoURL}
                      alt={doc.name}
                      className="w-16 h-16 rounded-full object-cover mb-4 shadow"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold mb-4">
                      {getInitials(doc.name)}
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {doc.specialization}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    📍 {doc.location}
                  </p>
                  <button
                    onClick={() => (window.location.href = `/doctors/${doc._id}`)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-full text-sm font-semibold"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDiscovery;
