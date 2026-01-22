"use client";

import React, { useState } from "react";
import {
  User,
  Building,
  CreditCard,
  Shield,
  Globe,
  Save,
  Sliders,
  Tag,
} from "lucide-react";
import { CONDITION_MULTIPLIERS, CATEGORY_MULTIPLIERS } from "../constants";

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Personal Details", icon: User },
    { id: "business", label: "Business Profile", icon: Building },
    { id: "pricing", label: "Pricing Engine", icon: Sliders },
    { id: "integrations", label: "App Connect", icon: Globe },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Portal Settings
        </h2>
        <p className="text-slate-500 mt-1">
          Configure your workspace and customize pricing strategies.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200
                ${
                  activeTab === tab.id
                    ? "bg-teal-50 text-teal-600 font-bold shadow-sm border border-teal-100/50"
                    : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent"
                }
              `}
            >
              <tab.icon
                size={18}
                className={
                  activeTab === tab.id ? "text-teal-600" : "text-slate-400"
                }
              />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </aside>

        <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
          <div className="p-8 flex-1 space-y-8 no-scrollbar overflow-y-auto">
            {activeTab === "profile" && (
              <div className="animate-in fade-in duration-500 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://picsum.photos/seed/alex/200"
                      className="w-24 h-24 rounded-[32px] object-cover ring-4 ring-slate-50"
                      alt="Profile"
                    />
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform">
                      <Save size={14} />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      Alexandra Valery
                    </h4>
                    <p className="text-slate-500 text-sm">
                      Owner & Merchant Lead
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100">
                      Merchant User
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Alexandra Valery"
                      className="w-full p-4 bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 rounded-2xl text-sm font-bold transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="alex@retold.io"
                      className="w-full p-4 bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 rounded-2xl text-sm font-bold transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="animate-in fade-in duration-500 space-y-8">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    Condition Multipliers
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    These factors are applied to the original price based on
                    item condition. Lower percentages represent higher wear.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(CONDITION_MULTIPLIERS).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-teal-500 transition-colors">
                              <Tag size={18} />
                            </div>
                            <span className="text-sm font-bold text-slate-700 capitalize">
                              {key.replace("_", " ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              defaultValue={value * 100}
                              className="w-16 p-2 bg-white border border-slate-200 rounded-lg text-sm font-black text-center outline-none focus:border-teal-500"
                            />
                            <span className="text-xs font-bold text-slate-400">
                              %
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    Category Multipliers
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Boost or reduce resale value based on demand trends for
                    specific product categories.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(CATEGORY_MULTIPLIERS)
                      .slice(0, 6)
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="p-4 bg-slate-50 rounded-2xl flex flex-col gap-3 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100"
                        >
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            {key}
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-black text-slate-700">
                              x{value.toFixed(2)}
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "profile" && activeTab !== "pricing" && (
              <div className="h-full flex flex-col items-center justify-center py-20 text-slate-300">
                <Shield size={64} className="mb-4 opacity-20" />
                <p className="font-bold">Module Restricted</p>
                <p className="text-xs">
                  Available for Premium Admin users only
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-900 transition-all text-sm">
              Discard Changes
            </button>
            <button className="px-8 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95 flex items-center gap-2 text-sm">
              <Save size={16} /> Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
