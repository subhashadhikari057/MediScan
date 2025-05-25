import React, { useState, useEffect } from "react";
import { Smile, RefreshCw } from "lucide-react";

const funnyTips = [
  "Not every headache means brain tumor. Breathe 😌",
  "Google said you're dying. Our AI disagrees. 👍",
  "Cough ≠ Cancer. Calm down, Sherlock. 🕵️‍♂️",
  "You're not patient zero. Probably just a cold. 🌡️",
  "Drinking water ≠ cure for all, but it helps 💧",
  "Googling symptoms at 2am is not self-care 🤯",
  "Our AI is smart, but still says: see a doctor 🩺",
];

const getRandomTip = () => funnyTips[Math.floor(Math.random() * funnyTips.length)];

const InfoModal = () => {
  const [tip, setTip] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTip(getRandomTip());
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTip(getRandomTip());
      setRefreshing(false);
    }, 300);
  };

  return (
    <div className="hidden sm:flex w-64 h-64 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-700 rounded-2xl p-4 shadow-md flex-col items-center justify-between text-center">
      {/* Top Icon */}
      <div className="bg-yellow-400 dark:bg-yellow-300 p-3 rounded-full shadow-sm">
        <Smile className="w-6 h-6 text-white dark:text-yellow-900" />
      </div>

      {/* Tip Text */}
      <div className="text-sm text-cyan-800 dark:text-cyan-100 px-2 leading-relaxed">
        <strong>Note:</strong> {tip}
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="text-cyan-600 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-100 p-2 rounded-full transition"
        title="New tip"
      >
        <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
};

export default InfoModal;
