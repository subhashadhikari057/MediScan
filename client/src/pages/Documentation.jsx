import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    title: "What is MediScan?",
    description:
      "MediScan is an AI-powered healthcare platform that connects users with verified doctors, allows seamless appointment booking, and helps manage medical profiles — all in one place.",
  },
  {
    title: "Getting Started",
    description:
      "To use MediScan, simply create an account by signing up. You can sign in using email or your Google account. Once logged in, you’ll be able to browse doctors and book appointments.",
  },
  {
    title: "Booking Appointments",
    description:
      "Visit the doctor discovery page, select a verified doctor, and click 'Book Appointment'. Choose your preferred date and time, and submit. You can view your bookings in your dashboard.",
  },
  {
    title: "Finding Doctors",
    description:
      "Use filters to find doctors based on specialization and location. Each doctor profile contains credentials, availability, and a secure contact option.",
  },
  {
    title: "User Roles",
    description:
      "There are 3 types of users:\n\n• User: Can search doctors, book appointments, manage profile.\n• Doctor: Can manage their schedule and appointments.\n• Admin: Can manage all users, doctors, and appointments.",
  },
  {
    title: "FAQs",
    description:
      "• Can I cancel my appointment? — Not yet, but feature is coming soon.\n• Are doctors verified? — Yes, all listed doctors go through an admin verification process.\n• How do I update my profile? — Navigate to 'My Profile' from the menu.",
  },
];

const Documentation = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4 text-primary dark:text-cyan-400">Documentation</h1>
        <p className="mb-10 text-slate-600 dark:text-slate-300">
          Welcome to the MediScan user guide. This page will help you understand how to use the platform effectively.
        </p>

        {sections.map((section, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-2xl font-semibold text-primary dark:text-cyan-300 mb-2">{section.title}</h2>
            <p className="whitespace-pre-line text-slate-700 dark:text-slate-200 leading-relaxed">{section.description}</p>
          </div>
        ))}

        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">Need further help? Contact our support team.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;
