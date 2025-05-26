import React, { useState, useEffect } from "react";
import { Apple, RefreshCw, HeartPulse } from "lucide-react";

const vitaminData = [
  {
    name: "Vitamin A",
    benefit: "Supports vision, skin health, and immune function.",
    source: "Carrots, sweet potatoes, spinach",
  },
  {
    name: "Vitamin B12",
    benefit: "Boosts energy and supports red blood cell production.",
    source: "Eggs, meat, dairy products",
  },
  {
    name: "Vitamin C",
    benefit: "Strengthens immunity and acts as an antioxidant.",
    source: "Oranges, strawberries, bell peppers",
  },
  {
    name: "Vitamin D",
    benefit: "Helps absorb calcium and supports bone health.",
    source: "Sunlight, fortified milk, salmon",
  },
  {
    name: "Vitamin E",
    benefit: "Protects cells from damage (antioxidant).",
    source: "Nuts, seeds, green leafy vegetables",
  },
  {
    name: "Vitamin K",
    benefit: "Essential for blood clotting and bone health.",
    source: "Kale, broccoli, Brussels sprouts",
  },
];

const getRandomVitamin = () => {
  const index = Math.floor(Math.random() * vitaminData.length);
  return vitaminData[index];
};

const VitaminOfTheDayBox = () => {
  const [vitamin, setVitamin] = useState(getRandomVitamin());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setVitamin(getRandomVitamin());
      setRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setVitamin(getRandomVitamin());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl bg-gradient-to-br from-emerald-50 to-lime-50 dark:from-emerald-900/40 dark:to-lime-900/30 border border-emerald-200 dark:border-emerald-700 rounded-2xl px-6 py-5 shadow-md hover:shadow-lg transition-all duration-300 mt-6">
      <div className="flex items-start justify-between">
        {/* Left side */}
        <div className="flex items-start gap-4">
          <div className="bg-emerald-400 dark:bg-emerald-300 p-2 rounded-full flex items-center justify-center shadow-sm">
            <Apple className="w-5 h-5 text-white dark:text-emerald-900" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <HeartPulse className="w-4 h-4" />
              Vitamin of the Day
            </h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Boost your daily nutrition
            </p>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 p-2 rounded-full transition"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Vitamin Info */}
      <div className="mt-4 text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
        <strong>{vitamin.name}:</strong> {vitamin.benefit}<br />
        <span className="text-xs text-emerald-700 dark:text-emerald-300">
          🥗 Food sources: {vitamin.source}
        </span>
      </div>
    </div>
  );
};

export default VitaminOfTheDayBox;
