import React, { useState, useEffect } from "react";
import { Lightbulb, RefreshCw, Sparkles } from "lucide-react";

const tips = [
  "Drinking water improves brain performance by 14%.",
  "Regular walking reduces the risk of heart disease.",
  "Sleep is essential for immune system strength.",
  "Laughter really can boost your immune system.",
  "Eating colorful vegetables helps fight inflammation.",
  "Screen time before bed can disrupt sleep quality.",
  "Taking deep breaths can reduce stress instantly.",
  "A 10-minute walk can boost your mood for up to 2 hours.",
  "Eating nuts regularly can improve heart health.",
  "Meditation for just 5 minutes daily reduces anxiety.",
];

const getRandomTip = () => {
  const index = Math.floor(Math.random() * tips.length);
  return tips[index];
};

const HealthTipBox = () => {
  const [tip, setTip] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setTip(getRandomTip());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTip(getRandomTip());
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <div className="w-full max-w-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl px-6 py-5 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        {/* Left side: Icon + Title */}
        <div className="flex items-start gap-4">
          <div className="bg-yellow-400 dark:bg-yellow-300 p-2 rounded-full flex items-center justify-center shadow-sm">
            <Lightbulb className="w-5 h-5 text-white dark:text-yellow-900" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Health Tip
            </h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Daily wellness insight</p>
          </div>
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 p-2 rounded-full transition"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Tip text */}
      <div className="mt-4 text-base text-emerald-900 dark:text-emerald-200 leading-relaxed">
        <span className="font-semibold">Did you know?</span>{" "}
        <span>{tip}</span>
      </div>
    </div>
  );
};

export default HealthTipBox;
