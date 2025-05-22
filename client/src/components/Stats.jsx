import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Activity, Users, Award } from "lucide-react";

const stats = [
  {
    label: "Accuracy Rate",
    value: "98%",
    icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
  },
  {
    label: "24/7 Availability",
    value: "Always",
    icon: <Activity className="h-6 w-6 text-teal-500" />,
  },
  {
    label: "Users Worldwide",
    value: "10M+",
    icon: <Users className="h-6 w-6 text-teal-500" />,
  },
  {
    label: "Medical Partners",
    value: "500+",
    icon: <Award className="h-6 w-6 text-teal-500" />,
  },
];

// Animation config
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const Stats = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-white to-teal-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-16">
          <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
            Trusted Worldwide
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl py-8 px-4 md:px-6 flex flex-col items-center border border-gray-100 dark:border-gray-700"
            >
              <div className="mb-3">
                {stat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
