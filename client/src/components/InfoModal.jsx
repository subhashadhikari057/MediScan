import React, { useState, useEffect } from "react";
import { Smile, RefreshCw, Sparkles } from "lucide-react";

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
    <div className="w-full max-w-3xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/40 dark:to-amber-950/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl px-6 py-5 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        {/* Left side */}
        <div className="flex items-start gap-4">
          <div className="bg-yellow-400 dark:bg-yellow-300 p-2 rounded-full flex items-center justify-center shadow-sm">
            <Smile className="w-5 h-5 text-white dark:text-yellow-900" />
          </div>
          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Fun Health Insight
            </h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Not everything's serious 😄</p>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 p-2 rounded-full transition"
          title="Get another tip"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Tip Text */}
      <div className="mt-4 text-base text-yellow-900 dark:text-yellow-200 leading-relaxed">
        <span className="font-semibold">Reminder:</span>{" "}
        <span>{tip}</span>
      </div>
    </div>
  );
};

export default InfoModal;
