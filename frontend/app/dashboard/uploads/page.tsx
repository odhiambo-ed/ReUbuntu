"use client";

import React from "react";
import Link from "next/link";
import { useUploads } from "@/features/uploads";
import {
  Loader2,
  FileText,
  History,
  MoreVertical,
  Trash2,
  Plus,
} from "lucide-react";

export default function UploadsPage() {
  const { data: uploadsData, isLoading } = useUploads({ page: 1, limit: 20 });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const uploads = uploadsData?.data ?? [];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Upload History
          </h2>
          <p className="text-slate-500 mt-2">
            View and manage all your inventory uploads.
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-black rounded-2xl hover:bg-teal-600 shadow-xl shadow-teal-500/20 transition-all active:scale-95"
        >
          <Plus size={18} /> New Upload
        </Link>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
          <History size={24} className="text-teal-500" />
          All Uploads ({uploads.length})
        </h3>

        {uploads.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-600">No uploads yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Upload your first inventory CSV to get started
            </p>
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-teal-500 text-white font-bold rounded-2xl hover:bg-teal-600 transition-all"
            >
              <Plus size={18} /> Upload Inventory
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 group-hover:bg-teal-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 tracking-tight">
                      {upload.filename}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {new Date(upload.created_at).toLocaleDateString()} •{" "}
                      {upload.total_rows} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Success Rate
                    </p>
                    <span className="text-xs font-black text-teal-600">
                      {upload.success_rate.toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <span
                      className={`text-xs font-black ${
                        upload.status === "completed"
                          ? "text-teal-600"
                          : upload.status === "failed"
                            ? "text-red-500"
                            : "text-orange-500"
                      }`}
                    >
                      {upload.status === "completed"
                        ? "Successful"
                        : upload.status === "failed"
                          ? "Failed"
                          : "Processing"}
                    </span>
                  </div>
                  <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
