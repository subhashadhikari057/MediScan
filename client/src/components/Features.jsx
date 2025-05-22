import React from "react";
import { Brain, Camera, Search, Lock } from "lucide-react";

const features = [
  {
    title: "AI-Powered Symptom Analysis",
    description:
      "Our advanced algorithm provides reliable condition suggestions with urgency levels.",
    icon: <Brain className="h-6 w-6 text-white" />,
    bg: "from-teal-600 to-cyan-500",
  },
  {
    title: "Skin Image Diagnosis",
    description:
      "Upload skin rash or lesion photos to detect conditions using our AI image model.",
    icon: <Camera className="h-6 w-6 text-white" />,
    bg: "from-cyan-500 to-blue-500",
  },
  {
    title: "Specialist Matching",
    description:
      "Based on your diagnosis, get recommended doctors filtered by location, language, or ratings.",
    icon: <Search className="h-6 w-6 text-white" />,
    bg: "from-blue-500 to-indigo-500",
  },
  {
    title: "Secure Health Records",
    description:
      "All your medical data is encrypted and accessible only to you and approved doctors.",
    icon: <Lock className="h-6 w-6 text-white" />,
    bg: "from-indigo-500 to-purple-500",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
            Key Features
          </span>
        </h2>
        <p className="text-lg text-gray-600 mb-16">
          Designed for accessibility, accuracy, and ease of use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <div
                className={`p-3 rounded-lg bg-gradient-to-r ${feature.bg}`}
              >
                {feature.icon}
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
