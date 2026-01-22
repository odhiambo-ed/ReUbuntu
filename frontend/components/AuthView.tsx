"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  Chrome,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  User,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AuthViewProps {
  onSuccess?: () => void;
  errorMessage?: string | null;
}

// Password strength calculation
function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500" };
  return { score, label: "Strong", color: "bg-green-500" };
}

const AuthView: React.FC<AuthViewProps> = ({ onSuccess, errorMessage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  // Show error message from props as toast
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  // Password strength
  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );

  // Password requirements check
  const passwordRequirements = useMemo(
    () => ({
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    }),
    [password],
  );

  // Check if passwords match
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          toast.error(error.message || "Invalid email or password");
        } else {
          toast.success("Login successful!");
          setTimeout(() => {
            onSuccess?.();
          }, 100);
        }
      } else {
        // Validation for signup
        if (!name.trim()) {
          toast.warning("Please enter your name");
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          toast.warning("Password must be at least 8 characters");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.warning("Passwords do not match");
          setLoading(false);
          return;
        }

        const { error } = await signUpWithEmail(email, password, { name });
        if (error) {
          toast.error(error.message || "Failed to create account");
        } else {
          toast.success(
            "Account created! Please check your email to verify your account.",
          );
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setTimeout(() => {
            setIsLogin(true);
          }, 1500);
        }
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    toast.info("Redirecting to Google...");

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

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
            <div className="mb-8">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                {isLogin ? "Hello again." : "Welcome."}
              </h3>
              <p className="text-slate-500 mt-3 font-medium">
                {isLogin
                  ? "Sign in to manage your inventory batch."
                  : "Join the circular fashion economy today."}
              </p>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-5">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 font-black text-slate-700 transition-all text-sm shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Chrome size={20} />
                )}
                Continue with Google
              </button>

              <div className="relative flex items-center py-3">
                <div className="grow border-t border-slate-100"></div>
                <span className="shrink mx-4 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                  Or use email
                </span>
                <div className="grow border-t border-slate-100"></div>
              </div>

              <div className="space-y-4">
                {/* Name field - only for signup */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                        size={18}
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        required={!isLogin}
                        disabled={loading}
                        className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-teal-500 rounded-2xl text-sm font-bold transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@retold.io"
                      required
                      disabled={loading}
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-teal-500 rounded-2xl text-sm font-bold transition-all outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {isLogin ? "Security Key" : "Password"}
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={isLogin ? 1 : 8}
                      disabled={loading}
                      className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-teal-500 rounded-2xl text-sm font-bold transition-all outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password strength indicator - only for signup */}
                  {!isLogin && password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{
                              width: `${(passwordStrength.score / 6) * 100}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            passwordStrength.label === "Weak"
                              ? "text-red-500"
                              : passwordStrength.label === "Medium"
                                ? "text-yellow-600"
                                : "text-green-500"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div
                          className={`flex items-center gap-1 ${passwordRequirements.minLength ? "text-green-600" : "text-slate-400"}`}
                        >
                          {passwordRequirements.minLength ? (
                            <Check size={12} />
                          ) : (
                            <X size={12} />
                          )}
                          8+ characters
                        </div>
                        <div
                          className={`flex items-center gap-1 ${passwordRequirements.hasLowercase ? "text-green-600" : "text-slate-400"}`}
                        >
                          {passwordRequirements.hasLowercase ? (
                            <Check size={12} />
                          ) : (
                            <X size={12} />
                          )}
                          Lowercase
                        </div>
                        <div
                          className={`flex items-center gap-1 ${passwordRequirements.hasUppercase ? "text-green-600" : "text-slate-400"}`}
                        >
                          {passwordRequirements.hasUppercase ? (
                            <Check size={12} />
                          ) : (
                            <X size={12} />
                          )}
                          Uppercase
                        </div>
                        <div
                          className={`flex items-center gap-1 ${passwordRequirements.hasNumber ? "text-green-600" : "text-slate-400"}`}
                        >
                          {passwordRequirements.hasNumber ? (
                            <Check size={12} />
                          ) : (
                            <X size={12} />
                          )}
                          Number
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password field - only for signup */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                        size={18}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required={!isLogin}
                        disabled={loading}
                        className={`w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none disabled:opacity-50 ${
                          confirmPassword && !passwordsMatch
                            ? "border-red-300 focus:border-red-500"
                            : confirmPassword && passwordsMatch
                              ? "border-green-300 focus:border-green-500"
                              : "focus:border-teal-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {confirmPassword && !passwordsMatch && (
                      <p className="text-xs text-red-500 font-medium ml-1">
                        Passwords do not match
                      </p>
                    )}
                    {confirmPassword && passwordsMatch && (
                      <p className="text-xs text-green-500 font-medium ml-1 flex items-center gap-1">
                        <Check size={12} /> Passwords match
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  (!isLogin && !passwordsMatch && confirmPassword !== "")
                }
                className="w-full py-5 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-95 flex items-center justify-center gap-3 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={22} />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-slate-500 font-medium">
                {isLogin ? "New to the platform?" : "Already a merchant?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="font-black text-teal-600 hover:text-teal-700 underline underline-offset-4"
                >
                  {isLogin ? "Get started" : "Login now"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
