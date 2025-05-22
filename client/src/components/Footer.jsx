import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-900 dark:bg-gray-950 text-white py-16 px-4 md:px-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Logo & Mission */}
        <div>
          <div className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            MediScan
          </div>
          <p className="text-gray-400 dark:text-gray-500 mb-4 max-w-sm">
            Your AI-powered health companion for fast, accessible diagnosis and expert care.
          </p>
          <div className="flex gap-4 mt-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <button
                key={index}
                className="p-2 rounded-full bg-gray-800 hover:bg-teal-600 transition-colors"
                aria-label={`Open ${Icon.name}`}
              >
                <Icon className="h-5 w-5 text-white" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 dark:text-gray-500 text-sm">
            {["Home", "How It Works", "Features", "Contact", "Terms", "Privacy"].map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    const el = document.getElementById(item.toLowerCase().replace(/\s+/g, "-"));
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-white flex items-center gap-2 transition-all"
                >
                  <ChevronRight className="h-3 w-3" />
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="text-gray-400 dark:text-gray-500 text-sm space-y-3">
            <li>📍 123 Health Street, Kathmandu, Nepal</li>
            <li>📞 +977-9800000000</li>
            <li>📧 contact@mediscan.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 dark:text-gray-600 text-sm">
        © {new Date().getFullYear()} MediScan. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
