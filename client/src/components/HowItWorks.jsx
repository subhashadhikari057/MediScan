import React from "react";
import { Brain, Stethoscope, Search } from "lucide-react";

const steps = [
  {
    step: "1",
    title: "Enter Symptoms",
    description:
      "Describe your symptoms or upload a skin image. Our dynamic form makes it quick and easy.",
    icon: <Brain className="h-8 w-8 text-white" />,
    bg: "from-teal-500 to-cyan-500",
  },
  {
    step: "2",
    title: "Get AI Diagnosis",
    description:
      "Our AI model analyzes your data and suggests possible conditions along with urgency level.",
    icon: <Stethoscope className="h-8 w-8 text-white" />,
    bg: "from-cyan-500 to-blue-500",
  },
  {
    step: "3",
    title: "Book a Doctor",
    description:
      "Find and book qualified specialists near you based on the AI’s recommendation.",
    icon: <Search className="h-8 w-8 text-white" />,
    bg: "from-blue-500 to-indigo-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
            How It Works
          </span>
        </h2>
        <p className="text-lg text-gray-600 mb-16">
          Just three simple steps to access fast, accurate, and smart healthcare.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-8 shadow hover:shadow-lg transition"
            >
              <div
                className={`p-4 rounded-full bg-gradient-to-r ${step.bg} mb-4`}
              >
                {step.icon}
              </div>
              <span className="text-sm font-bold text-teal-600 mb-2">Step {step.step}</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
