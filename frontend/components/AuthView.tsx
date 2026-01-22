"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Chrome, ShieldCheck } from "lucide-react";

interface AuthViewProps {
  onLogin: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-[1000px] w-full bg-slate-50 rounded-[48px] shadow-2xl shadow-slate-200/40 overflow-hidden flex flex-col md:flex-row border border-slate-100">
        <div className="w-full md:w-1/2 bg-teal-500 p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 font-black text-2xl">
                <svg
                  width="28"
                  height="28"
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
                <h1 className="text-2xl font-black tracking-tight">ReUbuntu</h1>
                <p className="text-[10px] font-bold text-teal-100 uppercase tracking-widest leading-none">
                  Merchant Portal
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-black leading-tight mb-8">
              Second-hand first, <br />
              scale second.
            </h2>
            <p className="text-teal-50/80 text-lg leading-relaxed max-w-sm">
              The only inventory portal designed specifically for deadstock and
              resale merchants.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <ShieldCheck size={24} />
              </div>
              <p className="text-sm font-bold">
                Encrypted inventory data & secure listing sync.
              </p>
            </div>
            <div className="p-8 bg-white/10 rounded-[32px] backdrop-blur-xl border border-white/20">
              <p className="text-sm font-medium italic opacity-90">
                &quot;ReUbuntu automated our pricing and listings in one
                afternoon. Absolute game changer.&quot;
              </p>
              <p className="text-xs font-black mt-4 uppercase tracking-widest opacity-70">
                — Sarah Chen, Retold
              </p>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400 rounded-full blur-[120px] opacity-40"></div>
        </div>

        <div className="w-full md:w-1/2 p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                {isLogin ? "Hello again." : "Welcome."}
              </h3>
              <p className="text-slate-500 mt-3 font-medium">
                {isLogin
                  ? "Sign in to manage your inventory batch."
                  : "Join the circular fashion economy today."}
              </p>
            </div>

            <div className="space-y-6">
              <button className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 font-black text-slate-700 transition-all text-sm shadow-sm active:scale-[0.98]">
                <Chrome size={20} /> Continue with Google
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                  Or use email
                </span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Work Email
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                      size={18}
                    />
                    <input
                      type="email"
                      placeholder="alex@retold.io"
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-teal-500 rounded-2xl text-sm font-bold transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Security Key
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                      size={18}
                    />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-teal-500 rounded-2xl text-sm font-bold transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={onLogin}
                className="w-full py-5 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-95 flex items-center justify-center gap-3 text-lg mt-4"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight size={22} />
              </button>

              <p className="text-center text-sm text-slate-500 font-medium">
                {isLogin ? "New to the platform?" : "Already a merchant?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-black text-teal-600 hover:text-teal-700 underline underline-offset-4"
                >
                  {isLogin ? "Get started" : "Login now"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
