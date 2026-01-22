"use client";

import React from "react";
import { StatusType } from "../types";

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<StatusType, string> = {
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    priced: "bg-blue-50 text-blue-600 border-blue-100",
    listed: "bg-teal-50 text-teal-600 border-teal-100",
    unlisted: "bg-slate-50 text-slate-400 border-slate-100",
    sold: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <span
      className={`
      px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
      ${styles[status] || styles.pending}
    `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
