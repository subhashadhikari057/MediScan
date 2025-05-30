import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InfoModal from "../components/InfoModal";
import SecureChatBox from "../components/SecureChatBox";
import VitaminOfTheDayBox from "components/VitaminOfTheDayBox";
import axios from "axios";


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
const severityLabels = ["Minimal", "Mild", "Mild-Moderate", "Moderate", "Moderate-High", "High", "Severe", "Very Severe", "Extreme", "Critical"];

const SymptomChecker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    symptoms: [],
    duration: "",
    severity: 5,
    reliefFactors: "",
    model: "google/gemma-3-27b-it:free"
  });
  const [diagnosisResult, setDiagnosisResult] = useState("");
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

  const extractSectionLines = (text, startMarker, endMarker) => {
    const lines = text.split("\n");
    const start = lines.findIndex(line => line.trim().startsWith(startMarker));
    const end = lines.findIndex(line => line.trim().startsWith(endMarker));
    if (start === -1) return [];
    return lines.slice(start + 1, end !== -1 ? end : undefined)
      .filter(line => /^[-–•]/.test(line.trim()))
      .map(line => line.replace(/^[-–•]/, "").trim());
  };
  const handleExport = () => {
  const content = `
===== AI Health Report =====

✅ Likely Diagnosis:
${diagnosisText || "Diagnosis could not be determined at this time. Please try again with more specific symptoms."}

💡 Health Tips:
${healthTips.length ? healthTips.map(t => `- ${t}`).join("\n") : "No tips available."}

💊 Non-Prescription Remedies:
${medicines.length ? medicines.map(m => `- ${m}`).join("\n") : "None listed."}

⚠️ Advice:
${adviceText || "No medical advice generated."}

============================
Generated by MediScan
`;

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "mediscan_diagnosis.txt";
  link.click();
};


  const diagnosisTextLine = diagnosisResult.split("\n").find(line => line.trim().startsWith("1."));
const diagnosisText = diagnosisTextLine
  ? diagnosisTextLine.replace(/^1\.\s*/, "").trim()
  : "Our AI couldn’t confidently determine a diagnosis. Please try again with more detailed symptoms.";

  const healthTips = extractSectionLines(diagnosisResult, "2.", "3.");
  const medicines = extractSectionLines(diagnosisResult, "3.", "4.");
  const adviceText = diagnosisResult.split("\n").find(line => line.startsWith("4.") || line.startsWith("5.")) || "Not available";

  const handleSubmit = async () => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/symptom/check`,
      formData
    );
    const data = res.data;
    setDiagnosisResult(data.diagnosis || "No diagnosis returned.");
    setShowModal(true);
  } catch (err) {
    setDiagnosisResult("⚠️ Something went wrong. Please try again.");
    setShowModal(true);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-gray-950 dark:to-slate-900 text-gray-900 dark:text-white transition-colors">
      
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden -z-10 dark:block hidden">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute bg-cyan-500/10 rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px` }}
          />
        ))}
      </div>

      <Navbar />
{/* <div className="mt-24 " />  */}
      <main className="max-w-7xl mx-auto px-4 pb-20 pt-24">
        <div className="mt-8 flex flex-col lg:flex-row gap-6">
          {/* Info Section */}
          <div className="hidden lg:block lg:w-1/3">
            <div className="sticky top-36">
              <InfoModal />
              <SecureChatBox />
              <VitaminOfTheDayBox />
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-2/3">
          
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-10 relative border border-gray-200 dark:border-slate-700">

              <motion.div
                className="absolute top-0 left-0 right-0 mx-auto mt-[-2rem] w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span role="img" aria-label="stethoscope" className="text-2xl">🩺</span>
              </motion.div>

              <h2 className="text-center text-2xl font-bold mt-10">Smart Symptom Checker</h2>
              <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                AI-powered health triage system
              </p>

              {/* Model Selector */}
              {currentStep === 1 && (
                <div className="mb-6">
                  <p className="text-sm text-teal-700 dark:text-teal-300 mb-2">
                    <strong>Recommended:</strong> Google Gemma 3 27B provides the most accurate and structured diagnosis results.
                  </p>
                  <label className="block text-sm font-semibold mb-1">Choose AI Model</label>
                  <select
                    className="w-full rounded border border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-slate-700 text-black dark:text-white p-2"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  >
                    <option value="google/gemma-3-27b-it:free">Gemma 3 27B</option>
                    <option value="mistralai/mistral-7b-instruct">Mistral 7B</option>
                    <option value="qwen/qwen2.5-vl-32b-instruct:free">Qwen 2.5 VL</option>
                  </select>
                </div>
              )}

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
          <div className="block lg:hidden mt-6 text-base italic text-cyan-700 dark:text-cyan-300 text-center px-6 flex flex-col items-center space-y-2">
  <img
    src="/assets/secure.png"
    alt="Secure Chat"
    className="w-8 h-8"
  />
  <span>This conversation is end-to-end encrypted. No one outside can read or listen.</span>
</div>

        </div>
      </main>

      <Footer />

      {/* Modal */}
      {/* You can keep your existing modal code here unchanged */}
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
        className="bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 max-w-4xl w-full text-left shadow-xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-center text-cyan-600 dark:text-cyan-400 mb-6">
          AI Diagnosis
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-800 dark:text-gray-100 leading-relaxed">
          {/* Left Column */}
          <div>
            <p className="font-semibold mb-1 text-cyan-600">✅ Likely Diagnosis:</p>
            <p className="mb-4 whitespace-pre-wrap">
              {diagnosisText
                ? diagnosisText.replace(/^\d+\.\s*/, "").replace(/^[-–•]?\s*/, "")
                : "Our AI could not confidently determine a diagnosis. Please try again with more detailed symptoms."}
            </p>

            <p className="font-semibold mb-1 text-cyan-600">💡 Health Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              {healthTips.length > 0 ? (
                healthTips.map((tip, idx) => (
                  <li key={idx}>{tip.replace(/^[-–•]?\s*(Tip \d+:)?\s*/, "")}</li>
                ))
              ) : (
                <li>Not available</li>
              )}
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <p className="font-semibold mb-1 text-cyan-600">💊 Non-Prescription Remedies:</p>
            <ul className="list-disc list-inside mb-4">
              {medicines.length > 0 ? (
                medicines.map((med, idx) => (
                  <li key={idx}>{med.replace(/^[-–•]?\s*/, "")}</li>
                ))
              ) : (
                <li>Not available</li>
              )}
            </ul>

            <p className="font-semibold mb-1 text-cyan-600">⚠️ Advice:</p>
            <p className="whitespace-pre-wrap text-sm">
              {adviceText.replace(/^\d+\.\s*/, "") || "No advice available."}
            </p>
          </div>
        </div>

        <div className="text-center mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => {
              setShowModal(false);
              setFormData({
                symptoms: [],
                duration: "",
                severity: 5,
                reliefFactors: "",
                model: "mistralai/mistral-7b-instruct"
              });
              setCurrentStep(1);
            }}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white text-sm"
          >
            Start New
          </button>

          <button
            onClick={handleExport} // define this in your component
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white text-sm"
          >
            Export Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


    </div>
  );
};

export default SymptomChecker;
