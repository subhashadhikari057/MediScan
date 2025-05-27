import React, { useState } from "react";
import axios from "axios";
import { FileText, Upload, Activity, Download, Loader2, Sun, Moon, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

const HealthScan = () => {
  const [mode, setMode] = useState("text");
  const [reportText, setReportText] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const handleAnalyze = async () => {
    if (mode === "text" && !reportText.trim()) {
      toast.error("Paste your lab report.");
      return;
    }
    if (mode === "image" && !image) {
      toast.error("Upload a report image.");
      return;
    }

    setLoading(true);
    setResult("");
    setShowFull(false);

    try {
      if (mode === "text") {
        const res = await axios.post(`${API}/api/healthscan`, { reportText });
        setResult(res.data.analysis);
        toast.success("Report analyzed!");
      } else {
        const formData = new FormData();
        formData.append("image", image);
        const res = await axios.post(`${API}/api/healthscan/image`, formData);
        setResult(res.data.analysis);
        toast.success("Image processed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to analyze.");
      setResult("❌ Error: Could not analyze report.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "healthscan-result.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleClear = () => {
    setResult("");
    setShowFull(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition text-gray-900 dark:text-white pb-24">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-sm">
        <Navbar />
      </div>

      <Toaster position="top-right" />

      <button
        onClick={toggleDark}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-700"
      >
        {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
      </button>

      <main className="pt-32 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold">
            <span className="text-teal-600">HealthScan</span> Lab Report{" "}
            <span className="text-gray-500 dark:text-gray-400">Analyzer</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Upload your lab reports or paste the text to get instant analysis and insights
          </p>
        </div>

        {/* Side-by-Side Layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-start">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl min-h-[520px] flex flex-col justify-between">
            <h2 className="text-xl font-semibold text-center mb-6">Report Analysis</h2>

            <div className="flex mb-4 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
              <button
                onClick={() => setMode("text")}
                className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 font-medium ${
                  mode === "text" ? "bg-teal-600 text-white" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <FileText className="w-4 h-4" />
                Paste Report Text
              </button>
              <button
                onClick={() => setMode("image")}
                className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 font-medium ${
                  mode === "image" ? "bg-cyan-600 text-white" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload Report Image
              </button>
            </div>

            {mode === "text" ? (
              <textarea
                rows="6"
                placeholder="Paste lab results..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="w-full p-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center rounded-xl mb-4">
                <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Choose file or drag and drop<br />
                  <span className="text-xs">PNG, JPG, PDF up to 10MB</span>
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full text-sm file:rounded file:border-0 file:bg-teal-600 file:text-white"
                />
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 rounded-md text-white font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
              {loading ? "Analyzing..." : "Analyze Report"}
            </button>
          </div>

          {/* Result Section */}
          <div className="mt-10 lg:mt-0 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border dark:border-gray-700 min-h-[520px] flex flex-col justify-between">

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-teal-600 dark:text-teal-400">🧠 AI Result</h3>
                {result && (
                  <button
                    onClick={handleClear}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Clear
                  </button>
                )}
              </div>

              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                {result ? (
                  <ReactMarkdown>
                    {showFull ? result : result.split("\n").slice(0, 10).join("\n")}
                  </ReactMarkdown>
                ) : (
                  <p className="italic text-gray-500 dark:text-gray-400">No result yet. Your analysis will appear here.</p>
                )}
              </div>
            </div>

            {result && (
              <div className="mt-6 space-y-3">
                {result.split("\n").length > 10 && (
                  <button
                    onClick={() => setShowFull((prev) => !prev)}
                    className="text-teal-600 dark:text-teal-400 text-sm underline"
                  >
                    {showFull ? "See less" : "See more"}
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download TXT
                </button>
              </div>
            )}
          </div>
          
        </div>
        {/* Feature Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto px-4">
  {[
    {
      title: "Instant Analysis",
      desc: "Get immediate insights from your lab reports.",
      icon: "⚡",
    },
    {
      title: "Secure & Private",
      desc: "Your health data is processed securely.",
      icon: "🔒",
    },
    {
      title: "Easy to Use",
      desc: "Simple interface for quick report analysis.",
      icon: "✨",
    },
  ].map((f, i) => (
    <div
      key={i}
      className="bg-white dark:bg-gray-800/60 rounded-xl shadow p-6 text-center space-y-2"
    >
      <div className="text-3xl">{f.icon}</div>
      <h4 className="font-semibold text-gray-900 dark:text-white">
        {f.title}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
    </div>
  ))}
</div>

      </main>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default HealthScan;
