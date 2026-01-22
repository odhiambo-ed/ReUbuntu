"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: "teal" | "orange" | "blue" | "emerald";
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  color,
}) => {
  const colorSchemes: Record<string, string> = {
    teal: "border-teal-100 bg-teal-50/30 text-teal-600",
    orange: "border-orange-100 bg-orange-50/30 text-orange-600",
    blue: "border-blue-100 bg-blue-50/30 text-blue-600",
    emerald: "border-emerald-100 bg-emerald-50/30 text-emerald-600",
  };

  const borderSchemes: Record<string, string> = {
    teal: "border-teal-500/20",
    orange: "border-orange-500/20",
    blue: "border-blue-500/20",
    emerald: "border-emerald-500/20",
  };

  return (
    <div
      className={`p-8 bg-white rounded-[32px] border-2 ${borderSchemes[color]} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
    >
      <div className="flex justify-between items-start mb-6">
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">
          {label}
        </span>
        <div className={`p-3 rounded-2xl ${colorSchemes[color]}`}>{icon}</div>
      </div>
      <div className="space-y-2">
        <span className="text-4xl font-black text-slate-900 tracking-tighter block">
          {value}
        </span>
        <p
          className={`text-[10px] font-black uppercase tracking-wider ${color === "orange" ? "text-orange-500" : "text-teal-500"}`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
