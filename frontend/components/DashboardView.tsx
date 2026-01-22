"use client";

import React from "react";
import Link from "next/link";
import {
  Download,
  MoreVertical,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  Wallet,
  ChevronRight,
} from "lucide-react";
import type { UploadSummary } from "@/features/uploads";
import StatCard from "./StatCard";

interface DashboardProps {
  stats: {
    totalItems: number;
    pendingPrice: number;
    listed: number;
    totalValue: number;
  };
  uploads: UploadSummary[];
}

const DashboardView: React.FC<DashboardProps> = ({ stats, uploads }) => {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome back, Merchant
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Here&apos;s what&apos;s happening with your deadstock today.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-2xl hover:bg-slate-50 transition-all text-sm shadow-sm active:scale-95">
          <Download size={18} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Items"
          value={stats.totalItems.toString()}
          icon={<Package size={20} />}
          trend="+12% from last week"
          color="teal"
        />
        <StatCard
          label="Pending Price"
          value={stats.pendingPrice.toString()}
          icon={<Clock size={20} />}
          trend="Awaiting merchant review"
          color="orange"
        />
        <StatCard
          label="Listed"
          value={stats.listed.toString()}
          icon={<CheckCircle size={20} />}
          trend="Live on marketplace"
          color="blue"
        />
        <StatCard
          label="Total Value"
          value={`R${stats.totalValue.toLocaleString()}`}
          icon={<Wallet size={20} />}
          trend="Estimated revenue potential"
          color="emerald"
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            Recent Uploads
          </h3>
          <Link
            href="/dashboard/upload"
            className="text-sm font-black text-teal-600 hover:text-teal-700 tracking-tight"
          >
            View History
          </Link>
        </div>

        <div className="bg-white rounded-[32px] border-2 border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                  <th className="px-8 py-6">File Name</th>
                  <th className="px-8 py-6">Date Uploaded</th>
                  <th className="px-8 py-6">Item Count</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {uploads.map((upload) => (
                  <tr
                    key={upload.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-[10px]">
                          CSV
                        </div>
                        <span className="text-sm font-black text-slate-700">
                          {upload.filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-400">
                      {new Date(upload.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      •{" "}
                      {new Date(upload.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-slate-700">
                      {upload.total_rows}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`
                        inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${upload.status === "completed" ? "bg-teal-50 text-teal-600 border border-teal-100" : "bg-orange-50 text-orange-600 border border-orange-100"}
                      `}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${upload.status === "completed" ? "bg-teal-500" : "bg-orange-500 animate-pulse"}`}
                        ></div>
                        {upload.status === "completed"
                          ? "Complete"
                          : "Processing"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-900 rounded-xl hover:bg-white transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400">
              Showing {uploads.length} of 12 recent uploads
            </p>
            <div className="flex gap-2">
              <button className="p-2 text-slate-200 cursor-not-allowed">
                <ChevronRight size={16} className="rotate-180" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-900">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
