"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { MOCK_UPLOADS, MOCK_INVENTORY } from "@/services/mockData";
import { OnboardingGuard } from "@/hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const stats = {
    totalItems: MOCK_INVENTORY.length,
    pendingPrice: MOCK_INVENTORY.filter((i) => i.status === "pending").length,
    listed: MOCK_INVENTORY.filter((i) => i.status === "listed").length,
    totalValue: MOCK_INVENTORY.reduce(
      (acc, i) => acc + (i.resale_price || 0),
      0,
    ),
  };

  return (
    <OnboardingGuard>
      <div className="flex h-screen bg-white">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          uploads={MOCK_UPLOADS}
          stats={stats}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header setIsSidebarOpen={setIsSidebarOpen} />

          <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>

          <div className="p-4 lg:hidden sticky bottom-0 bg-white border-t border-slate-100">
            <Link
              href="/dashboard/upload"
              className="w-full py-4 bg-teal-500 text-white font-black rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              <Upload size={18} /> Upload Inventory
            </Link>
          </div>
        </main>
      </div>
    </OnboardingGuard>
  );
}
