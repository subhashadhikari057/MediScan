import React from "react";
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

const Stats = () => {
  return (
    <section className="py-16 bg-gray-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center"
            >
              <div className="mb-2">{stat.icon}</div>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
