import React from "react";
import { motion } from "framer-motion";
import { Brain, Camera, Search, Lock } from "lucide-react";

// Animation configuration
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

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
    <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-white to-teal-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
            Key Features
          </span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-16">
          Designed for accessibility, accuracy, and ease of use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex items-start gap-5 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all"
            >
              <div
                className={`p-3 rounded-lg bg-gradient-to-r ${feature.bg} shadow-md`}
              >
                {feature.icon}
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
