"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const url = new URL(window.location.href);

        // Supabase with `detectSessionInUrl:true` will automatically exchange
        // the `code` parameter and persist the session to localStorage.
        // We poll `getSession()` for up to ~3 seconds until session becomes available.
        let session: Session | null = null;
        for (let i = 0; i < 30; i++) {
          const { data } = await supabase.auth.getSession();
          session = data.session;
          if (session) break;
          await new Promise((r) => setTimeout(r, 100));
        }

        if (!session) {
          throw new Error("No session found");
        }

        // Gather tokens for SSR cookie sync
        const accessToken =
          session.access_token ?? url.searchParams.get("access_token");
        const refreshToken =
          session.refresh_token ?? url.searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
          try {
            const response = await fetch("/api/callback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                access_token: accessToken,
                refresh_token: refreshToken,
              }),
            });
            if (!response.ok) {
              console.error(
                "[AuthCallback] API cookie sync error:",
                await response.text(),
              );
            }
            // Wait a brief moment to ensure cookies are flushed
            await new Promise((res) => setTimeout(res, 300));
          } catch (cookieErr) {
            console.error("[AuthCallback] Cookie sync exception:", cookieErr);
          }
        } else {
          console.warn(
            "[AuthCallback] Missing tokens for SSR cookie sync – proceeding client-side only",
          );
        }

        // Check for redirect param
        const redirectParam = url.searchParams.get("redirect");
        if (redirectParam) {
          router.replace(redirectParam);
          return;
        }

        // Redirect to dashboard
        console.log("[AuthCallback] Redirecting to dashboard");
        router.push("/dashboard");
      } catch (error) {
        console.error("[AuthCallback] Callback error:", error);
        setError(
          error instanceof Error ? error.message : "Authentication failed",
        );

        // Redirect to login with error message
        const errorMessage = encodeURIComponent(
          error instanceof Error ? error.message : "Authentication failed",
        );
        router.push(`/auth?error=auth_callback_error&message=${errorMessage}`);
      }
    };

    handleAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Authentication Error
            </h3>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/auth")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-teal-500 hover:bg-teal-600 transition-all"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      <p className="mt-4 text-sm text-slate-500 font-medium">
        Setting up your account...
      </p>
    </div>
  );
}
