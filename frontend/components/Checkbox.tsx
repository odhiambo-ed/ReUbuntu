"use client";

import React from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`
      w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center
      ${checked ? "bg-teal-500 border-teal-500 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"}
    `}
  >
    {checked && <Check size={14} className="text-white" />}
  </button>
);

export default Checkbox;
