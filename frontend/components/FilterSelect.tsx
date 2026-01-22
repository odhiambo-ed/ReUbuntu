"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  onChange,
  options,
}) => (
  <div className="relative group">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none pl-4 pr-10 py-2 bg-slate-50 border-transparent hover:bg-slate-100 transition-all rounded-xl text-sm font-semibold outline-none cursor-pointer focus:ring-2 focus:ring-teal-500/10 min-w-[140px]"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
      <ChevronDown size={16} />
    </div>
    <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
      {label}
    </span>
  </div>
);

export default FilterSelect;
