import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "MediScan has changed how we approach initial consultations. Patients are better informed and confident.",
    author: "Dr. Sarah Johnson",
    role: "Chief Medical Officer",
    rating: 5,
  },
  {
    quote:
      "I have chronic health issues. MediScan saves me unnecessary trips to the hospital. It’s a must-have.",
    author: "Michael Chen",
    role: "Patient",
    rating: 3,
  },
  {
    quote:
      "The AI caught my skin condition early. I booked a dermatologist within minutes. Life-saving tech.",
    author: "Emma Rodriguez",
    role: "Patient",
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[activeIndex];

  return (
    <section className="py-24 px-4 md:px-8 bg-white" id="testimonials">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
          What People Are Saying
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Trusted by professionals and patients across the globe.
        </p>

        <div className="bg-gray-50 p-8 rounded-xl shadow-lg relative">
          <p className="text-xl text-gray-700 italic mb-6">“{testimonial.quote}”</p>
          <div className="text-teal-600 font-semibold text-lg">{testimonial.author}</div>
          <div className="text-gray-500 text-sm">{testimonial.role}</div>
          <div className="flex justify-center mt-4">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`h-3 w-3 rounded-full ${
                  i === activeIndex ? "bg-teal-600 w-6" : "bg-gray-300"
                } transition-all duration-300`}
                onClick={() => setActiveIndex(i)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
