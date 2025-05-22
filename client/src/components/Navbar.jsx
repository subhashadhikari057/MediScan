import React, { useState, useEffect } from "react";
import { Stethoscope, Menu, X } from "lucide-react";

// Utility: className combiner
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Simple Button component (THEMED)
const Button = ({ children, className, variant = "default", ...props }) => {
  const base = "px-4 py-2 rounded-full font-medium transition-all duration-300";
  const variants = {
    default: "bg-gradient-to-r from-teal-600 to-cyan-500 text-white hover:from-teal-700 hover:to-cyan-600",
    outline: "border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white",
    ghost: "bg-transparent text-teal-700 hover:bg-teal-50",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-cyan-400 rounded-full blur opacity-70"></div>
            <div className="relative bg-white rounded-full p-1">
              <Stethoscope className="h-6 w-6 text-teal-600" />
            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
            MediScan
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {["Home", "How It Works", "About", "Contact"].map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-gray-700 hover:text-teal-600 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline">
            Login
          </Button>
          <Button>
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <Button variant="ghost" className="md:hidden p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 bg-white shadow-lg absolute top-16 left-0 right-0 z-40">
          <div className="flex flex-col space-y-4">
            {["Home", "How It Works", "About", "Contact"].map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-gray-700 hover:text-teal-600 py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" className="w-full">
                Login
              </Button>
              <Button className="w-full">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
