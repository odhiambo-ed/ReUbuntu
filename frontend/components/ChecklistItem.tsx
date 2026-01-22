"use client";

import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface ChecklistItemProps {
  label: string;
  status: "success" | "warning" | "error";
  count: string | number;
  onClick?: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  label,
  status,
  count,
  onClick,
}) => {
  const icons = {
    success: <CheckCircle2 size={14} className="text-teal-500" />,
    warning: <Clock size={14} className="text-orange-500" />,
    error: <AlertCircle size={14} className="text-red-500" />,
  };

  return (
    <div
      className={`flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl ${onClick ? "cursor-pointer hover:bg-slate-50" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {icons[status]}
        <span className="text-xs font-bold text-slate-600 truncate">
          {label}
        </span>
      </div>
      <span
        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${status === "error" ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"}`}
      >
        {count}
      </span>
    </div>
  );
};

export default ChecklistItem;
