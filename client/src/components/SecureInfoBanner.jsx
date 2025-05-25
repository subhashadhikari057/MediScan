import React from "react";
import { ShieldCheck } from "lucide-react";

const SecureInfoBanner = () => {
  return (
    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-5 py-4 rounded-2xl shadow-lg flex items-center gap-3 mb-6">
      <ShieldCheck className="w-6 h-6 text-white flex-shrink-0" />
      <div className="text-sm md:text-base">
        <strong>Your data is secure.</strong> Your health information is encrypted and never shared. We prioritize your privacy.
      </div>
    </div>
  );
};

export default SecureInfoBanner;
