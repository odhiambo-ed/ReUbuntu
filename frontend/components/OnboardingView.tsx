"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Check,
  ChevronRight,
  User,
  Building,
  MapPin,
} from "lucide-react";

interface OnboardingViewProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "About You",
    description: "Let's get your personal merchant identity set up.",
    icon: User,
    color: "bg-teal-500",
  },
  {
    title: "Company Info",
    description: "Tell us about your business or storefront.",
    icon: Building,
    color: "bg-blue-500",
  },
  {
    title: "Shipping & Returns",
    description: "Where should we handle physical logistics from?",
    icon: MapPin,
    color: "bg-orange-500",
  },
  {
    title: "Ready to go!",
    description:
      "Your portal is prepared. Let's start importing your inventory.",
    icon: Check,
    color: "bg-emerald-500",
  },
];

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const ActiveIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="flex gap-2 mb-16">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all duration-700 ${idx <= currentStep ? "bg-teal-500" : "bg-slate-100"}`}
            />
          ))}
        </div>

        <div className="flex flex-col items-center text-center space-y-10">
          <div
            className={`w-24 h-24 ${steps[currentStep].color} rounded-[32px] flex items-center justify-center text-white shadow-2xl transition-all duration-500 transform`}
          >
            <ActiveIcon size={44} />
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="w-full space-y-4">
            {currentStep === 0 && (
              <input
                type="text"
                placeholder="Enter your full name..."
                className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-3xl text-lg font-bold outline-none transition-all shadow-inner"
              />
            )}
            {currentStep === 1 && (
              <input
                type="text"
                placeholder="Enter company name..."
                className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-3xl text-lg font-bold outline-none transition-all shadow-inner"
              />
            )}
            {currentStep === 2 && (
              <textarea
                placeholder="Enter business address..."
                rows={3}
                className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-3xl text-lg font-bold outline-none transition-all shadow-inner no-scrollbar resize-none"
              ></textarea>
            )}
            {currentStep === 3 && (
              <div className="p-8 bg-teal-50 border-2 border-teal-100 rounded-3xl flex items-center gap-6 text-left">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm">
                  <Sparkles size={32} />
                </div>
                <div>
                  <p className="text-xl font-black text-teal-900 leading-tight">
                    Verification Successful
                  </p>
                  <p className="text-teal-600 font-bold mt-1">
                    Your ReUbuntu portal is now online.
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-6 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-3xl transition-all shadow-2xl shadow-teal-500/30 active:scale-95 flex items-center justify-center gap-3 text-xl"
          >
            {currentStep === steps.length - 1 ? "Go to Dashboard" : "Next Step"}
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
