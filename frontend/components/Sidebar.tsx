"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Upload,
  Settings,
  X,
  LogOut,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import ChecklistItem from "./ChecklistItem";
import { Upload as UploadType } from "../types";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  uploads: UploadType[];
  stats: {
    totalItems: number;
    pendingPrice: number;
    listed: number;
    totalValue: number;
  };
}

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  { id: "upload", label: "Upload", icon: Upload, href: "/dashboard/upload" },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    href: "/dashboard/inventory",
  },
  {
    id: "listings",
    label: "Listings",
    icon: ShieldCheck,
    href: "/dashboard/listings",
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  uploads,
  stats,
}) => {
  const pathname = usePathname();
  const { signOut, logoutInProgress, user } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-slate-50 border-r border-slate-200 transition-transform duration-300 lg:static lg:translate-x-0
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}
    >
      <div className="flex flex-col h-full">
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M12 16v3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none">
                ReUbuntu
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Merchant Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 no-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-200
                ${
                  isActive(item.href)
                    ? "bg-teal-500 text-white font-bold shadow-lg shadow-teal-500/20"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                }
              `}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}

          <div className="pt-8 pb-4">
            <p className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Daily Checklist
            </p>
            <div className="space-y-3 px-2">
              <ChecklistItem
                label="Fix Failed Uploads"
                status={
                  uploads.some((u) => u.error_count > 0) ? "error" : "success"
                }
                count={uploads.reduce((acc, u) => acc + u.error_count, 0)}
              />
              <ChecklistItem
                label="Price Pending"
                status={stats.pendingPrice > 0 ? "warning" : "success"}
                count={stats.pendingPrice}
              />
              <ChecklistItem
                label="Inventory Space"
                status="success"
                count="69%"
              />
            </div>
          </div>
        </nav>

        <div className="p-4 space-y-2">
          <Link
            href="/dashboard/settings"
            className={`
              w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-200
              ${pathname === "/dashboard/settings" ? "bg-slate-200 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-200/50"}
            `}
          >
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </Link>

          <div className="p-4 bg-white border border-slate-200 rounded-[24px] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://picsum.photos/seed/alex/100"
                className="w-10 h-10 rounded-xl object-cover"
                alt="User avatar"
                width={40}
                height={40}
              />
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">
                  {user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[10px] font-bold text-teal-600 uppercase">
                  Premium
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              disabled={logoutInProgress}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all text-xs font-bold disabled:opacity-50"
            >
              {logoutInProgress ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LogOut size={14} />
              )}
              {logoutInProgress ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
