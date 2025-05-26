import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, RefreshCw } from "lucide-react";

const secureMessages = [
  "Your conversations are secure and encrypted.",
  "Chats are not recorded. Privacy is our priority.",
  "We never store any personal health data.",
  "End-to-end security ensures safe AI interaction.",
  "Your privacy is protected during every session.",
];

const getRandomMessage = () => {
  const index = Math.floor(Math.random() * secureMessages.length);
  return secureMessages[index];
};

const SecureChatBox = () => {
  const [message, setMessage] = useState(getRandomMessage());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMessage(getRandomMessage());
      setIsRefreshing(false);
    }, 300);
  };

  // Automatically update message every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(getRandomMessage());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
<div className="w-full sm:max-w-md md:max-w-lg lg:max-w-3xl bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-800/40 dark:to-cyan-900/30 border border-cyan-200 dark:border-cyan-700 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-md hover:shadow-lg transition-all duration-300 mt-6">      <div className="flex items-start justify-between">
        {/* Left side */}
        <div className="flex items-start gap-4">
          <div className="bg-cyan-500 dark:bg-cyan-600 p-2 rounded-full flex items-center justify-center shadow-sm">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Secure AI Chat
            </h3>
            <p className="text-sm text-cyan-600 dark:text-cyan-400">Private & Encrypted</p>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 p-2 rounded-full transition"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Message Text */}
      <div className="mt-4 text-base text-cyan-900 dark:text-cyan-200 leading-relaxed">
        <span className="font-semibold">Security Notice:</span>{" "}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default SecureChatBox;
