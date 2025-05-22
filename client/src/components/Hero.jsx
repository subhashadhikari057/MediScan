import React from "react";
import { Brain, Camera, Search } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-teal-100 to-white pt-24">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 leading-tight">
        Empowering You With <br />
        <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
          AI-Powered Health Diagnosis
        </span>
      </h1>

      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
        Use our smart symptom checker or skin scan to get fast, reliable insights. No queues. No confusion.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="#symptom-checker"
          className="px-6 py-3 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-2"
        >
          <Brain className="w-5 h-5" />
          Check My Symptoms
        </a>
        <a
          href="#skin-detector"
          className="px-6 py-3 bg-cyan-500 text-white rounded hover:bg-cyan-600 flex items-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Upload Skin Issue
        </a>
        <a
          href="#doctor-search"
          className="px-6 py-3 bg-gray-100 text-teal-700 border border-teal-600 rounded hover:bg-teal-50 flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          Find a Doctor
        </a>
      </div>
    </section>
  );
};

export default Hero;
