import React from "react";
import { ChevronRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Take Control of Your Health Journey
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-10">
          Join thousands of users who trust MediScan for fast, AI-powered diagnosis and expert medical support.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="symptom-checker"
            className="inline-flex items-center justify-center gap-2 bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold hover:text-teal-700 transition-all"
          >
            Get Started for Free
            <ChevronRight className="w-4 h-4" />
          </a>

          <a
            href=""
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
          >
            Watch Demo
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </a>
        </div>

        <p className="mt-6 text-white/70 text-sm">
          No credit card required • Free basic plan • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
