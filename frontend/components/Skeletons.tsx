"use client";

import React from "react";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export const StatCardSkeleton: React.FC = () => {
  return (
    <div
      className={`relative overflow-hidden p-8 bg-white rounded-[32px] border-2 border-slate-100 shadow-sm ${shimmer}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
        <div className="w-11 h-11 rounded-2xl bg-slate-100 animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="h-10 w-24 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="border-b border-slate-50">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
      </td>
      <td className="px-8 py-6">
        <div className="h-4 w-12 bg-slate-200 rounded animate-pulse" />
      </td>
      <td className="px-8 py-6">
        <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
      </td>
      <td className="px-8 py-6 text-right">
        <div className="h-8 w-8 bg-slate-100 rounded-xl animate-pulse ml-auto" />
      </td>
    </tr>
  );
};

export const DashboardTableSkeleton: React.FC<{ rows?: number }> = ({
  rows = 5,
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-white rounded-[32px] border-2 border-slate-100 shadow-sm ${shimmer}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
              <th className="px-8 py-6">
                <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
              </th>
              <th className="px-8 py-6">
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
              </th>
              <th className="px-8 py-6">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
              </th>
              <th className="px-8 py-6">
                <div className="h-3 w-14 bg-slate-200 rounded animate-pulse" />
              </th>
              <th className="px-8 py-6 text-right">
                <div className="h-3 w-12 bg-slate-200 rounded animate-pulse ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 border-t border-slate-50 flex items-center justify-between">
        <div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded animate-pulse" />
          <div className="w-8 h-8 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const InventoryTableRowSkeleton: React.FC = () => {
  return (
    <tr className="border-b border-slate-50">
      <td className="px-6 py-4">
        <div className="w-5 h-5 bg-slate-100 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-16 bg-slate-100 rounded-md animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-4 w-16 bg-slate-100 rounded animate-pulse ml-auto" />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse ml-auto" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse mx-auto" />
      </td>
    </tr>
  );
};

export const InventoryTableSkeleton: React.FC<{ rows?: number }> = ({
  rows = 10,
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1 ${shimmer}`}
    >
      <div className="overflow-x-auto overflow-y-auto no-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
              <th className="px-6 py-5 w-12">
                <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
              </th>
              <th className="px-6 py-5">
                <div className="h-3 w-10 bg-slate-200 rounded animate-pulse" />
              </th>
              <th className="px-6 py-5">
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
              </th>
              <th className="px-6 py-5">
                <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
              </th>
              <th className="px-6 py-5">
                <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
              </th>
              <th className="px-6 py-5 text-right">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse ml-auto" />
              </th>
              <th className="px-6 py-5 text-right">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse ml-auto" />
              </th>
              <th className="px-6 py-5 text-center">
                <div className="h-3 w-14 bg-slate-200 rounded animate-pulse mx-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {Array.from({ length: rows }).map((_, i) => (
              <InventoryTableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 border-t border-slate-100 flex items-center justify-between shrink-0">
        <div className="h-4 w-36 bg-slate-100 rounded animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-slate-100 rounded-lg animate-pulse" />
          <div className="w-9 h-9 bg-slate-200 rounded-lg animate-pulse" />
          <div className="w-9 h-9 bg-slate-100 rounded-lg animate-pulse" />
          <div className="w-9 h-9 bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const UploadCardSkeleton: React.FC = () => {
  return (
    <div
      className={`relative overflow-hidden bg-white p-5 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 ${shimmer}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:block space-y-2">
          <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-12 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="hidden sm:block space-y-2">
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-px bg-slate-100 hidden md:block" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-slate-100 rounded-xl animate-pulse" />
          <div className="w-9 h-9 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="h-10 w-80 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-12 w-40 bg-slate-100 rounded-2xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-7 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
        <DashboardTableSkeleton rows={5} />
      </div>
    </div>
  );
};

export const InventoryPageSkeleton: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-slate-200 rounded-lg animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
            <div className="h-5 w-24 bg-teal-50 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-11 w-32 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-11 w-40 bg-teal-100 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex flex-col md:flex-row items-center gap-3 shrink-0">
        <div className="relative flex-1 w-full">
          <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="h-10 w-32 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 w-10 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>

      <InventoryTableSkeleton rows={10} />
    </div>
  );
};

export const UploadsPageSkeleton: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="h-9 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-12 w-36 bg-teal-100 rounded-2xl animate-pulse" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 bg-teal-100 rounded animate-pulse" />
          <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <UploadCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const UploadViewSkeleton: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="text-center md:text-left space-y-3">
        <div className="h-9 w-56 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-slate-100 rounded animate-pulse" />
      </div>

      <div
        className={`relative overflow-hidden p-12 border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center gap-6 ${shimmer}`}
      >
        <div className="w-20 h-20 rounded-3xl bg-slate-100 animate-pulse" />
        <div className="space-y-3 text-center">
          <div className="h-6 w-80 bg-slate-200 rounded animate-pulse mx-auto" />
          <div className="h-4 w-64 bg-slate-100 rounded animate-pulse mx-auto" />
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-32 bg-teal-100 rounded-2xl animate-pulse" />
          <div className="h-12 w-44 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 bg-teal-100 rounded animate-pulse" />
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <UploadCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
