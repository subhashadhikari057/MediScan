import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InfoModal from "../components/InfoModal";
import SecureInfoBanner from "../components/SecureInfoBanner";

const symptoms = [
  "Fever", "Cough", "Headache", "Sore throat", "Runny nose", "Body aches",
  "Fatigue", "Nausea", "Dizziness", "Chest pain", "Shortness of breath",
  "Loss of taste/smell", "Stomach pain", "Diarrhea", "Rash"
];

const durations = [
  { value: "1-day", label: "1 day" },
  { value: "2-3-days", label: "2-3 days" },
  { value: "4-7-days", label: "4-7 days" },
  { value: "1-2-weeks", label: "1-2 weeks" },
  { value: "more-than-2-weeks", label: "More than 2 weeks" },
];

const severityEmojis = ["😊", "🙂", "😐", "😕", "😟", "😰", "😨", "😱", "🤒", "🤕"];
const severityLabels = [
  "Minimal", "Mild", "Mild-Moderate", "Moderate", "Moderate-High",
  "High", "Severe", "Very Severe", "Extreme", "Critical"
];

const SymptomChecker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    symptoms: [],
    duration: "",
    severity: 5,
    reliefFactors: ""
  });
  const [particles, setParticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const particlesInit = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
    }));
    setParticles(particlesInit);

    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: (p.x + p.dx + 100) % 100,
          y: (p.y + p.dy + 100) % 100,
        }))
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleCheckbox = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.symptoms.length > 0;
    if (currentStep === 2) return formData.duration;
    return true;
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowModal(true);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-gray-950 dark:to-slate-900 text-gray-900 dark:text-white transition-colors">

      {/* Particles in Background (Dark Mode) */}
      <div className="absolute inset-0 overflow-hidden -z-10 dark:block hidden">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute bg-cyan-500/10 rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`
            }}
          />
        ))}
      </div>

      <Navbar />

      {/* Secure Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-24">
        <SecureInfoBanner />
      </div>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-6 px-4 pt-8 pb-20">
        {/* Left Sidebar - InfoModal */}
        <div className="lg:col-span-2 hidden lg:block">
          <div className="sticky top-36">
            <InfoModal />
          </div>
        </div>

        {/* Right Main Form */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-10 relative border border-gray-200 dark:border-slate-700">

            <motion.div
              className="absolute top-0 left-0 right-0 mx-auto mt-[-2rem] w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse shadow-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span role="img" aria-label="stethoscope" className="text-2xl">🩺</span>
            </motion.div>

            <h2 className="text-center text-2xl font-bold mt-10">Smart Symptom Checker</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">AI-powered health triage system</p>

            {/* Steps */}
            {currentStep === 1 && (
              <>
                <h3 className="font-semibold mb-2">Select your symptoms:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {symptoms.map(symptom => (
                    <label key={symptom} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.symptoms.includes(symptom)}
                        onChange={() => handleCheckbox(symptom)}
                        className="appearance-none w-4 h-4 rounded-full border border-gray-400 checked:bg-cyan-500 checked:border-cyan-500 transition-all duration-200"
                      />
                      {symptom}
                    </label>
                  ))}
                </div>
                {formData.symptoms.length > 0 && (
                  <div className="mt-6 px-4 py-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg border border-teal-300 dark:border-teal-600">
                    <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                      Selected symptoms: {formData.symptoms.join(", ")}
                    </p>
                  </div>
                )}
              </>
            )}

            {currentStep === 2 && (
              <>
                <h3 className="font-semibold mb-2">Duration of symptoms:</h3>
                <div className="space-y-2">
                  {durations.map(d => (
                    <label key={d.value} className="block cursor-pointer">
                      <input
                        type="radio"
                        value={d.value}
                        checked={formData.duration === d.value}
                        onChange={() => setFormData(prev => ({ ...prev, duration: d.value }))}
                        className="mr-2 accent-cyan-500"
                      />
                      {d.label}
                    </label>
                  ))}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h3 className="font-semibold mb-2">Severity (1-10):</h3>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: +e.target.value }))}
                  className="w-full accent-cyan-500"
                />
                <div className="text-center mt-2 text-lg">
                  <span className="text-3xl">{severityEmojis[formData.severity - 1]}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{severityLabels[formData.severity - 1]}</p>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h3 className="font-semibold mb-2">What makes it better/worse?</h3>
                <textarea
                  rows={4}
                  placeholder="E.g., symptoms worsen at night, paracetamol helps..."
                  className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-black dark:text-white"
                  value={formData.reliefFactors}
                  onChange={(e) => setFormData(prev => ({ ...prev, reliefFactors: e.target.value }))}
                />
              </>
            )}

            {currentStep === 5 && (
              <>
                <h3 className="font-semibold mb-2">Review Your Data</h3>
                <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Symptoms:</strong> {formData.symptoms.join(", ")}</li>
                  <li><strong>Duration:</strong> {durations.find(d => d.value === formData.duration)?.label}</li>
                  <li><strong>Severity:</strong> {formData.severity} – {severityLabels[formData.severity - 1]}</li>
                  <li><strong>Relief Notes:</strong> {formData.reliefFactors || "N/A"}</li>
                </ul>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </button>
              {currentStep < 5 ? (
                <button
                  className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!isStepValid()}
                >
                  Next
                </button>
              ) : (
                <button
                  className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500"
                  onClick={handleSubmit}
                >
                  {loading ? "Analyzing..." : "Get Diagnosis"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-xl p-8 max-w-md w-full text-center shadow-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">Diagnosis: Common Cold</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Confidence: 85%</p>
              <ul className="text-left text-sm text-gray-600 dark:text-gray-300 mb-4 list-disc list-inside">
                <li>Get plenty of rest</li>
                <li>Stay hydrated</li>
                <li>Use paracetamol if needed</li>
              </ul>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ symptoms: [], duration: "", severity: 5, reliefFactors: "" });
                  setCurrentStep(1);
                }}
                className="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white"
              >
                Start New
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SymptomChecker;
