"use client";

import React from "react";
import { Bell, Search, Menu } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProfile } from "@/features/profile";

interface HeaderProps {
  setIsSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  const { user } = useAuth();
  const { data: profile } = useCurrentProfile();

  const fullName = profile?.full_name || user?.user_metadata?.name || "User";
  const companyName =
    (profile?.metadata?.company_name as string) || "Premium Merchant";

  const userAvatar =
    (profile?.metadata?.avatar_url as string) ||
    user?.user_metadata?.avatar_url ||
    "/Default-avatar.jpg";
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-6">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
        >
          <Menu size={24} />
        </button>
        <div className="relative group w-96 hidden md:block">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search inventory, SKU, batch..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 rounded-2xl text-sm transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl relative transition-all">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        <div className="h-8 w-px bg-slate-100 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-tight">
              {fullName}
            </p>
            <p className="text-[10px] font-bold text-slate-400">
              {companyName}
            </p>
          </div>
          <Image
            src={userAvatar}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
            alt="User avatar"
            width={40}
            height={40}
            onError={(e) => {
              e.currentTarget.src = "/Default-avatar.jpg";
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
